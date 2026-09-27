@echo off
setlocal
cd /d "%~dp0"
where node.exe >nul 2>&1
if errorlevel 1 (
  echo Node.js is required. Opening the HTML file directly instead.
  start "" "%~dp0index.html"
  exit /b 0
)
echo Trip Planner is starting. Keep this window open while using the app.
node.exe server.js
endlocal
