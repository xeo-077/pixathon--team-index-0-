@echo off
cd /d "%~dp0.."
where python >nul 2>nul
if errorlevel 1 (
 echo Python is needed for this local shortcut. Use the hosted game link instead.
 pause
 exit /b 1
)
start "" http://localhost:8000
echo Keep this window open while playing. Press Ctrl+C to stop.
python -m http.server 8000 --directory dist
pause
