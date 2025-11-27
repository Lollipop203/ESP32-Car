@echo off
echo Opening ESP32 Car Controller in Chrome...

REM Find Chrome installation
set CHROME_PATH=""

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

if %CHROME_PATH%=="" (
    echo Chrome not found! Opening with default browser...
    start "" "%~dp0index.html"
) else (
    echo Found Chrome, opening app...
    start "" %CHROME_PATH% "--allow-file-access-from-files" "%~dp0index.html"
)
