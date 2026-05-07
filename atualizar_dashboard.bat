@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   ATUALIZADOR DO DASHBOARD - PNTP 2026 (OSASCO)
echo ============================================================
echo.

:: 1. Verificar se o Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python não encontrado. Por favor, instale o Python.
    pause
    exit /b 1
)

:: 2. Executar o Scraper
echo [1/3] Iniciando o Scraper Python (isso pode levar alguns minutos)...
echo.
python legacy/scripts/analisar_portal.py

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] O scraper terminou com alguns alertas ou erros. 
    echo Verifique as mensagens acima.
)

:: 3. Mover os resultados para a pasta do Next.js
echo.
echo [2/3] Atualizando os dados do Dashboard...

:: Criar diretório public/data se não existir
if not exist "public\data" mkdir "public\data"

:: Copiar relatorio_pntp.json (o principal)
if exist "relatorio_pntp.json" (
    move /y "relatorio_pntp.json" "public\data\relatorio_pntp.json"
    echo    - relatorio_pntp.json atualizado.
) else if exist "legacy\scripts\relatorio_pntp.json" (
    move /y "legacy\scripts\relatorio_pntp.json" "public\data\relatorio_pntp.json"
    echo    - relatorio_pntp.json atualizado.
)

:: Copiar outros arquivos de apoio
if exist "estrutura_portal.json" move /y "estrutura_portal.json" "public\data\estrutura_portal.json"
if exist "legacy\scripts\estrutura_portal.json" move /y "legacy\scripts\estrutura_portal.json" "public\data\estrutura_portal.json"

:: Mover o relatório HTML para a pasta de reports legada
if not exist "legacy\reports" mkdir "legacy\reports"
if exist "relatorio_pntp.html" move /y "relatorio_pntp.html" "legacy\reports\relatorio_pntp_last_run.html"
if exist "legacy\scripts\relatorio_pntp.html" move /y "legacy\scripts\relatorio_pntp.html" "legacy\reports\relatorio_pntp_last_run.html"

echo.
echo [3/3] Concluido com sucesso!
echo.
echo O Dashboard Web agora reflete os dados coletados hoje.
echo Para ver as mudanças, rode 'npm run dev' ou faca push para o GitHub/Vercel.
echo.
echo ============================================================
pause
