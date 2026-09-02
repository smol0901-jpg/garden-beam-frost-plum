# -*- coding: utf-8 -*-
"""
setup.py — установщик приложения garden-beam-frost-plum (app-builder-workspace)
под Windows 10/11. Поднимает фронт+бэк на http://0.0.0.0:8080 и открывает
доступ с телефона в той же Wi-Fi сети.

Запуск: двойной клик по run.bat  ИЛИ  python setup.py
"""
from __future__ import annotations
import os, sys, subprocess, socket, time, secrets, urllib.request, json
from pathlib import Path
from datetime import datetime

REPO_URL    = "https://github.com/smol0901-jpg/garden-beam-frost-plum.git"
REPO_DIR    = "garden-beam-frost-plum"
PORT        = 8080
HOST        = "0.0.0.0"
NODE_MIN    = 18
NPM_MIN     = 9
PY_MIN      = (3, 8)
BETTER_AUTH_SECRET_BYTES = 32
APP_NAME = "garden-beam-frost-plum"

def hr(c="\u2500", n=70): print(c * n)
def step(t):  hr("="); print("  " + t); hr("=")
def info(m):  print("  [i] " + m)
def ok(m):    print("  [\u2713] " + m)
def warn(m):  print("  [!] " + m)
def err(m):   print("  [\u2717] " + m)

def parse_version(s):
    out = []
    for part in s.strip().split("."):
        digits = ""
        for ch in part:
            if ch.isdigit(): digits += ch
            else: break
        out.append(int(digits) if digits else 0)
    while len(out) < 3: out.append(0)
    return tuple(out[:3])

def have(cmd, args=("--version",)):
    try:
        r = subprocess.run([cmd, *args], capture_output=True, text=True, timeout=10)
        return r.returncode == 0, (r.stdout + r.stderr).strip().splitlines()[0] if (r.stdout or r.stderr) else ""
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False, ""

def local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return None

def check_prereqs():
    step("1/8  Проверка окружения")
    if sys.version_info < PY_MIN:
        err("Нужен Python " + str(PY_MIN[0]) + "." + str(PY_MIN[1]) + "+, у тебя " + str(sys.version_info.major) + "." + str(sys.version_info.minor))
        sys.exit(1)
    ok("Python " + str(sys.version_info.major) + "." + str(sys.version_info.minor) + " (раннер)")
    g_ok, g_ver = have("git", ("--version",))
    if not g_ok:
        err("Git не найден. Поставь: https://git-scm.com/download/win  (в PATH)"); sys.exit(1)
    ok("Git: " + g_ver)
    n_ok, n_ver = have("node", ("--version",))
    if not n_ok:
        err("Node.js не найден. Поставь LTS: https://nodejs.org/  (в PATH)"); sys.exit(1)
    if parse_version(n_ver) < (NODE_MIN, 0, 0):
        err("Node.js " + n_ver + " слишком старый, нужен >= " + str(NODE_MIN) + ". Обнови с nodejs.org"); sys.exit(1)
    ok("Node.js: " + n_ver)
    a_ok, a_ver = have("npm", ("--version",))
    if not a_ok:
        err("npm не найден (идёт с Node.js). Переустанови Node.js LTS"); sys.exit(1)
    if parse_version(a_ver) < (NPM_MIN, 0, 0):
        warn("npm " + a_ver + " староват (< " + str(NPM_MIN) + "). Будет работать, но лучше обновить")
    else:
        ok("npm: " + a_ver)

def run_cmd(cmd, cwd=None, check=True):
    info("$ " + (cmd if isinstance(cmd, str) else " ".join(cmd)))
    return subprocess.run(cmd, cwd=cwd, check=check, shell=isinstance(cmd, str))

def clone_or_update(here):
    step("2/8  Клонирование / обновление репозитория")
    target = here / REPO_DIR
    if (target / ".git").is_dir():
        info("Репозиторий уже склонирован — обновляю")
        run_cmd(["git", "pull", "--ff-only"], cwd=target)
        ok("Обновлено")
    else:
        info("Клонирую " + REPO_URL + " -> " + str(target))
        run_cmd(["git", "clone", REPO_URL, str(target)])
        ok("Склонировано")
    return target

def install_deps(repo):
    step("3/8  Установка зависимостей (npm install)")
    run_cmd("npm install", cwd=repo, check=False)
    if not (repo / "node_modules").is_dir():
        err("node_modules не появился. Открой лог npm install и пришли мне ошибку.")
        sys.exit(1)
    ok("node_modules на месте")

def write_env(repo):
    step("4/8  Настройка .env")
    env_path = repo / ".env"
    secret = secrets.token_urlsafe(BETTER_AUTH_SECRET_BYTES)
    ip_hint = local_ip() or "127.0.0.1"
    body = (
        "# Сгенерировано setup.py " + datetime.now().isoformat(timespec='seconds') + "\n"
        "DATABASE_URL=\n"
        "VITE_AUTH_ENABLED=true\n"
        "BETTER_AUTH_SECRET=" + secret + "\n"
        "BETTER_AUTH_URL=http://" + ip_hint + ":" + str(PORT) + "\n"
    )
    env_path.write_text(body, encoding="utf-8")
    ok(".env создан: " + str(env_path))
    info("DATABASE_URL пуст -> БД будет локальная (PGlite в файле)")

def firewall_allow():
    step("5/8  Windows-файрвол: открыть порт " + str(PORT))
    rule = "garden-beam-frost-plum Node"
    subprocess.run(["netsh","advfirewall","firewall","delete","rule","name=" + rule], capture_output=True, text=True)
    res = subprocess.run(["netsh","advfirewall","firewall","add","rule",
        "name=" + rule, "dir=in", "action=allow", "protocol=TCP", "localport=" + str(PORT), "profile=private"],
        capture_output=True, text=True)
    if res.returncode == 0:
        ok("Правило '" + rule + "' добавлено (входящие TCP " + str(PORT) + ", профиль Private)")
    else:
        warn("Не удалось добавить правило файрвола (нужны права администратора).")
        warn("Открой вручную: 'Брандмауэр Windows' -> 'Доп. параметры' ->")
        warn("'Правила для входящих' -> 'Создать правило' -> Для порта TCP " + str(PORT))

def wait_for_server(url, timeout_s=120):
    info("Жду ответа от " + url + " (до " + str(timeout_s) + "с)...")
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as r:
                if r.status < 500:
                    ok("Сервер ответил: HTTP " + str(r.status))
                    return True
        except Exception:
            time.sleep(2)
    err("Сервер не ответил за отведённое время. Смотри лог в окне 'npm run dev'.")
    return False

def launch_dev(repo):
    step("6/8  Запуск dev-сервера в фоне")
    info("Открываю отдельное окно 'garden-dev' с логом сервера")
    cmd = 'start "garden-dev" cmd /k "cd /d \"' + str(repo) + '\" && npm run dev 2>&1 | tee setup-dev.log"'
    subprocess.run(cmd, shell=True)
    ok("Окно запущено. Сверни его — оно должно остаться открытым.")

def smoke_check():
    step("7/8  Проверка работоспособности")
    if not wait_for_server("http://127.0.0.1:" + str(PORT) + "/", timeout_s=120):
        sys.exit(1)
    try:
        with urllib.request.urlopen("http://127.0.0.1:" + str(PORT) + "/login", timeout=5) as r:
            ok("Страница логина: HTTP " + str(r.status))
    except Exception:
        warn("Страница /login не открылась — возможно, ассинхронная загрузка.")

def print_phone_instructions():
    step("8/8  Готово! Подключаем телефон")
    ip = local_ip() or "<твой-IP>"
    url = "http://" + ip + ":" + str(PORT)
    hr("\u00b7")
    print("  Твой локальный IP (предположительно): " + ip)
    print("  Адрес для телефона в той же Wi-Fi:      " + url)
    print()
    print("  На ТЕЛЕФОНЕ (в той же Wi-Fi):")
    print("    1. Открой камеру (или QR-сканер).")
    print("    2. Наведи на QR-код ниже — он откроет ссылку.")
    print("    3. Если камера не сканирует — вручную вбей адрес выше в браузер.")
    print()
    print("  Если НЕ открывается:")
    print("    - Телефон и ПК в ОДНОЙ Wi-Fi (не мобильный интернет).")
    print("    - Антивирус (Kaspersky/ESET/Dr.Web) может блокировать порт 8080.")
    print("    - Проверь 'ping " + ip + "' с телефона (через PingTools).")
    print()
    print("  Первый пользователь:")
    print("    1. Открой " + url + "/login")
    print("    2. Зарегистрируйся (email + пароль). Этот аккаунт станет 'владельцем' в БД.")
    print("    3. Остальные ребята тоже регистрируются через /login.")
    print()
    print("  Логи сервера: окно 'garden-dev' (не закрывай) и файл setup-dev.log.")
    print("  Остановить сервер: закрой окно 'garden-dev' или Ctrl+C в нём.")
    hr("\u00b7")
    try:
        qr_url = "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=" + urllib.parse.quote(url, safe="")
        info("QR-код (открой в браузере): " + qr_url)
        info("Ссылка для копирования: " + url)
    except Exception:
        pass

def main():
    hr("=")
    print("  Установщик " + APP_NAME)
    print("  Платформа: Windows | Доступ: Wi-Fi | Порт: " + str(PORT))
    hr("=")
    here = Path.cwd()
    try:
        check_prereqs()
        repo = clone_or_update(here)
        install_deps(repo)
        write_env(repo)
        firewall_allow()
        launch_dev(repo)
        smoke_check()
        print_phone_instructions()
    except KeyboardInterrupt:
        err("Прервано пользователем")
        sys.exit(130)
    except subprocess.CalledProcessError as e:
        err("Команда упала с кодом " + str(e.returncode) + ": " + str(e))
        sys.exit(1)

if __name__ == "__main__":
    main()
