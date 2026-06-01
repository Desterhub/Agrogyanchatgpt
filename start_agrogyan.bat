@echo off
set "APP_DIR=%~dp0agrogyan-gpt-main"

if not exist "%APP_DIR%\start_agrogyan.bat" (
    echo Could not find "%APP_DIR%\start_agrogyan.bat".
    pause
    exit /b 1
)

cd /d "%APP_DIR%"
call start_agrogyan.bat
