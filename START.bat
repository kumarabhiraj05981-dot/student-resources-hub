@echo off
setlocal
cd /d "%~dp0"

if not exist "backend\node_modules" (
  echo Dependencies are not installed yet. Run setup.bat first.
  pause
  exit /b 1
)
if not exist "frontend\node_modules" (
  echo Dependencies are not installed yet. Run setup.bat first.
  pause
  exit /b 1
)
if not exist "backend\.env" (
  echo backend\.env is missing. Run setup.bat first.
  pause
  exit /b 1
)

start "Student Hub Backend" cmd /k "cd /d "%~dp0backend" && npm start"
timeout /t 2 /nobreak >nul
start "Student Hub Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 127.0.0.1"

echo.
echo Student Resources Hub is starting...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Keep both terminal windows open while using the website.
pause
