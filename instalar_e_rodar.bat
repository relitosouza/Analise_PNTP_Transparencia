@echo off
chcp 65001 >nul
echo ============================================================
echo  PNTP 2026 - Instalacao e Analise do Portal de Osasco
echo ============================================================
echo.

:: Verifica Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado. Instale em https://python.org
    pause
    exit /b 1
)

echo [1/3] Instalando dependencias...
pip install playwright requests beautifulsoup4 --quiet
if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo [2/3] Instalando navegador Chromium para Playwright...
python -m playwright install chromium
if errorlevel 1 (
    echo [AVISO] Falha ao instalar Chromium - o script rodara em modo offline
)

echo [3/3] Executando analise do portal...
echo.
cd /d "%~dp0"
python analisar_portal.py

echo.
echo ============================================================
echo  Analise concluida! Abra relatorio_pntp.html no navegador
echo ============================================================

:: Abre o relatorio automaticamente
if exist relatorio_pntp.html (
    start relatorio_pntp.html
)

pause
