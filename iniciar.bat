@echo off
title Estudio Contable - Sistema de Gestion
echo ========================================================
echo   INICIANDO SISTEMA WEB PARA ESTUDIO CONTABLE (SaaS)
echo ========================================================
echo.
set PATH=C:\Users\Leandro\.gemini\antigravity\scratch\nodejs;%PATH%
cd /d "%~dp0"
echo Abriendo servidor local en http://localhost:5173 ...
echo.
start http://localhost:5173
npm run dev
pause
