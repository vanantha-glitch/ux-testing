@echo off
REM Batch file to start dev server and open prototype viewer
REM Usage: open-prototypes.bat

set PORT=3000
set URL=http://localhost:%PORT%/prototypes

echo Checking if dev server is running...

REM Check if port is in use (simple check using netstat)
netstat -an | findstr ":%PORT%" >nul
if %ERRORLEVEL% == 0 (
    echo Dev server appears to be running on port %PORT%
    echo Opening prototype viewer...
    start %URL%
) else (
    echo Starting dev server...
    start "Next.js Dev Server" cmd /k "npm run dev"
    
    echo Waiting for server to start...
    timeout /t 5 /nobreak >nul
    
    REM Try to open browser
    echo Opening prototype viewer...
    start %URL%
    
    echo.
    echo Dev server started in a new window.
    echo Close that window to stop the server.
)

