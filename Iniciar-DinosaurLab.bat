@echo off
setlocal
cd /d "%~dp0"

start "DinosaurLab server" /b node server.mjs
timeout /t 1 /nobreak >nul
start "" "http://localhost:4173"

exit
