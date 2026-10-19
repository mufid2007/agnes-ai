@echo off
echo ========================================================
echo   Launching Agnes 3.0 Flash Educational Platform
echo ========================================================

echo.
echo [1/2] Starting FastAPI Backend on http://localhost:8000...
start cmd /k "cd /d %~dp0backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && python run.py"

echo.
echo [2/2] Starting React Vite Frontend on http://localhost:5173...
start cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo.
echo Platform is launching! 
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
pause
