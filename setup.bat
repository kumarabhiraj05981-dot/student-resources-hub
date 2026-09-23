@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo   Student Resources Hub - First Time Setup
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install the current LTS version from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not available. Reinstall Node.js LTS and try again.
  pause
  exit /b 1
)

echo Node version:
node --version
echo npm version:
npm --version
echo.

if not exist "backend\.env" (
  copy /Y "backend\.env.example" "backend\.env" >nul
  echo Created backend\.env from the example.
) else (
  echo backend\.env already exists - keeping it.
)

if not exist "frontend\.env.local" (
  copy /Y "frontend\.env.example" "frontend\.env.local" >nul
  echo Created frontend\.env.local from the example.
) else (
  echo frontend\.env.local already exists - keeping it.
)

echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 goto :failed
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 goto :failed
cd ..

echo.
echo ==============================================
echo Setup completed.
echo ==============================================
echo.
echo IMPORTANT: Open backend\.env and enter:
echo   MONGO_URI
echo   JWT_SECRET
echo   CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
echo   GEMINI_API_KEY (for AI features)
echo.
echo Then double-click START.bat
pause
exit /b 0

:failed
cd /d "%~dp0"
echo.
echo Setup failed. Check the error above and try again.
pause
exit /b 1
