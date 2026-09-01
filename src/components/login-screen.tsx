import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AuthSplash() {
  return (
    <main className="paper-grain grid min-h-dvh place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-4xl font-semibold tracking-tight">Смена</p>
        <p className="mt-2 text-sm text-muted">Загрузка табеля…</p>
      </div>
    </main>
  );
}

export function LoginScreen() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Сотрудник",
          callbackURL: "/",
        });
        if (err) throw new Error(err.message || "Не удалось зарегистрироваться");
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (err) throw new Error(err.message || "Неверный email или пароль");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      setBusy(false);
    }
  }

  return (
    <main className="paper-grain min-h-dvh lg:grid lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-pine px-10 py-10 text-pine-fg lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-[10px] bg-pine-fg/10">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 7.5v5l3.2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-xl font-semibold">Смена</span>
        </div>
        <div>
          <p className="font-display text-5xl leading-[1.05] font-semibold tracking-tight">
            График.
            <br />
            Приход.
            <br />
            Уход.
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-pine-fg/75">
            Один табель для всей команды: расписание смен, отметка на месте и отчёт по часам — с
            ролями администратора, руководителя и сотрудника.
          </p>
        </div>
        <TimesheetPreview />
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <p className="font-display text-3xl font-semibold tracking-tight">Смена</p>
            <p className="mt-1 text-sm text-muted">Табель прихода и график работы</p>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Вход в табель</h1>
          <p className="mt-2 text-sm text-muted">
            Первый зарегистрировавшийся становится администратором и подтверждает остальных.
          </p>

          {authEnabled ? (
            <>
              <div className="mt-6 grid grid-cols-2 rounded-xl bg-ink/5 p-1">
                <button
                  type="button"
                  onClick={() => setMode("in")}
                  className={cn(
                    "h-10 rounded-[10px] text-sm font-medium",
                    mode === "in" ? "bg-raised text-ink shadow-[var(--shadow-card)]" : "text-muted",
                  )}
                >
                  Вход
                </button>
                <button
                  type="button"
                  onClick={() => setMode("up")}
                  className={cn(
                    "h-10 rounded-[10px] text-sm font-medium",
                    mode === "up" ? "bg-raised text-ink shadow-[var(--shadow-card)]" : "text-muted",
                  )}
                >
                  Регистрация
                </button>
              </div>

              <form className="mt-5 flex flex-col gap-3" onSubmit={onEmail}>
                {mode === "up" && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иванов Иван"
                      autoComplete="name"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                  />
                </div>
                {error && <p className="text-sm text-absent">{error}</p>}
                <Button type="submit" disabled={busy} size="lg">
                  {busy ? "Подождите…" : mode === "up" ? "Создать аккаунт" : "Войти"}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-subtle">
                <span className="h-px flex-1 bg-line-strong" />
                или
                <span className="h-px flex-1 bg-line-strong" />
              </div>

              <div className="flex flex-col gap-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                  >
                    Продолжить через {p.label}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-6 text-sm text-muted">Вход отключён.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function TimesheetPreview() {
  const rows = [
    ["09:02", "18:05", "офис"],
    ["08:57", "17:12", "склад"],
    ["—", "—", "вых."],
    ["09:18", "18:01", "опозд."],
  ];
  return (
    <div className="rounded-xl bg-pine-fg/8 p-4">
      <p className="text-[11px] font-medium tracking-wide text-pine-fg/60 uppercase">
        Сегодня · табель
      </p>
      <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-x-4 gap-y-2 font-mono text-sm">
        {rows.map((r, i) => (
          <div key={i} className="contents">
            <span className="tabular text-pine-fg/90">{r[0]}</span>
            <span className="tabular text-pine-fg/90">{r[1]}</span>
            <span className="text-right text-pine-fg/55">{r[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
