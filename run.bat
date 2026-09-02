@echo off
REM run.bat — двойной клик запускает setup.py
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  where py >nul 2>nul
  if errorlevel 1 (
    echo [!] Python ne najden. Postav s https://www.python.org/downloads/
    echo     Vo vremya ustanovki OBYAZATELNO otmet' "Add Python to PATH".
    pause
    exit /b 1
  )
  set "PY=py -3"
) else (
  set "PY=python"
)
echo [*] Zapuskayu %PY% setup.py ...
%PY% setup.py
echo.
echo [*] Gotovo. Nazhmi lyubuyu klavishu.
pause >nul
