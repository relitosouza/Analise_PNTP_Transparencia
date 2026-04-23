# Osasco Transparency Analysis (PNTP 2026)

Este projeto foi modernizado para uma aplicação web interativa utilizando Next.js 16 e Tailwind CSS v4.

## Estrutura do Projeto

- **`/`**: Aplicação Next.js (Dashboard interativo na raiz para deploy simplificado).
- **`/legacy`**: Código e dados originais em Python.
  - `/legacy/scripts`: Scripts de scraping (Playwright/BeautifulSoup).
  - `/legacy/data`: Dados JSON extraídos pelo scraper.
  - `/legacy/reports`: Relatórios HTML gerados anteriormente.

## Como Executar (Local)

### Dashboard Web
1. `npm install`
2. `npm run dev`
3. Acesse `http://localhost:3000`

### Scraper Python (Legacy)
Os scripts originais continuam funcionando. Para atualizar os dados do dashboard:
1. Execute os scripts em `legacy/scripts`.
2. Copie os arquivos `.json` gerados para `public/data/`.
3. O dashboard lerá os novos dados automaticamente.

## Deploy no Vercel

O projeto está pronto para o Vercel (Zero Config). 
- Basta conectar o repositório e o Vercel detectará o Next.js automaticamente na raiz.

## Metodologia PNTP 2026

A análise segue os critérios da Atricon/TCE-SP para o Ciclo 2026 do Programa Nacional de Transparência Pública.
- Score atual: 34% (Básico).
- Total de critérios: 100.
