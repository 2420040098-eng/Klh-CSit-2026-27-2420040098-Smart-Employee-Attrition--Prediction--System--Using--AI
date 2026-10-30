@echo off
echo ========================================================
echo  Starting AttritiXAI - Explainable HR Analytics System
echo ========================================================

start "AttritiXAI Backend (FastAPI)" cmd /k "cd /d %~dp0src\backend && python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 >nul

start "AttritiXAI Frontend (Vite React)" cmd /k "cd /d %~dp0src\frontend && npm.cmd run dev"

echo.
echo Both servers are starting!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ========================================================
