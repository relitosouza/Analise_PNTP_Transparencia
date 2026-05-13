#!/bin/bash

echo "============================================================"
echo "  ATUALIZADOR DO DASHBOARD - PNTP 2026 (OSASCO)"
echo "============================================================"
echo ""

# 1. Executar o Scraper
echo "[1/2] Iniciando o Scraper Python..."
python3 legacy/scripts/analisar_portal.py

# 2. Mover resultados
echo ""
echo "[2/2] Atualizando os dados do Dashboard..."

mkdir -p public/data

# Mover JSON
if [ -f "relatorio_pntp.json" ]; then
    mv relatorio_pntp.json public/data/relatorio_pntp.json
    echo "   - relatorio_pntp.json atualizado."
elif [ -f "legacy/scripts/relatorio_pntp.json" ]; then
    mv legacy/scripts/relatorio_pntp.json public/data/relatorio_pntp.json
    echo "   - relatorio_pntp.json atualizado."
fi

# Mover Estrutura
if [ -f "estrutura_portal.json" ]; then
    mv estrutura_portal.json public/data/estrutura_portal.json
elif [ -f "legacy/scripts/estrutura_portal.json" ]; then
    mv legacy/scripts/estrutura_portal.json public/data/estrutura_portal.json
fi

echo ""
echo "Concluído! Dashboard atualizado localmente."
echo "Faça o push para o GitHub para atualizar o Vercel."
