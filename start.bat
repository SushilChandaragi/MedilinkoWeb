@echo off
echo ============================================
echo    MediLinko Web - QR Healthcare System
echo ============================================
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/3] Installing dependencies...
echo This may take a few minutes on first run...
echo.

call npm install
if errorlevel 1 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

cd client
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo ✓ All dependencies installed
echo.

echo [3/3] Starting MediLinko Web...
echo.
echo Frontend will open at: http://localhost:3000
echo Backend API running at: http://localhost:5000/api
echo.
echo Press Ctrl+C to stop the servers
echo.

call npm run dev
