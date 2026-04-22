#!/usr/bin/env python3
"""
Mapeia as URLs reais do portal SMARAPD de Osasco.
Estratégia: clica cada item de menu e escuta mudanças de hash (React Router).
"""
import asyncio, io, json, sys
from pathlib import Path
from datetime import datetime

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

PORTAL_URL = "https://transparencia-osasco.smarapd.com.br"

# Textos de menu conhecidos (da estrutura_portal.json)
MENUS_CONHECIDOS = [
    "Sobre o Portal", "Saiba mais", "Dados Abertos", "Administração Pública",
    "Canais de participação", "Concursos e Processos Seletivos", "Concessões",
    "Contas Públicas", "Controladoria Geral do Município de Osasco",
    "Gestão de Pessoas", "Legislação e Imprensa Oficial do Município",
    "Licitações e Contratos", "Ouvidoria Geral", "Fala Cidadão", "Patrimônio",
    "Políticas, Planos Municipais, Ind. e Inf. Temática", "Projetos e Obras",
    "Terceiro Setor", "Convênios", "Convênios de Cooperação",
    "Peças Orçamentárias", "Peças Contábeis", "Estatísticas", "Emendas Parlamentares",
    "Fale Conosco", "Sumário", "FAQ", "Glossário",
    "Legislação sobre Transparência", "Manuais e Orientação Sobre Transparência",
    "Avaliações Sobre Transparencia Municipal",
    "Concursos e Processos Seletivos Próximos ou Aberto",
    "Relação de Concursos e Processos Seletivos",
    "Contábil", "Receitas", "Despesas", "Empenhos", "Financeiro", "Fornecedor",
    "Fornecimentos", "Repasses e Transferências", "Decretos de Execução Orçamentária",
    "Relatórios LRF - Lei de Responsabilidade Fiscal", "Prestação de Contas",
    "Situação de Regularidade Municipal", "Ordem Cronológica de Pagamentos",
    "Restos a Pagar", "Contábil Sintético", "Receita Analítica", "Receita Sintética",
    "Receita Corrente", "Receita Capital", "Receita Prevista por Rubrica",
    "Deduções da Receita", "Emendas Recebidas", "Emendas Transferências Especiais",
    "Receita Arrecadada por Rubrica", "Receitas Arrecadadas de Fundos Municipais",
    "Receita Arrecadada Transferências Constitucionais",
    "Renúncia de Receita e Transf. Intergovernamentais", "Divida Ativa",
    "Documentos para Pagamentos", "Despesas Sintéticas", "Despesas Filtradas",
    "Despesas com Viagens", "Participa Osasco", "Conselhos Municipais", "Governo Aberto",
]

async def clicar_e_capturar(page, texto: str) -> str | None:
    """Clica em um item de menu e retorna a URL resultante se mudou."""
    from playwright.async_api import TimeoutError as PWTimeout
    try:
        hash_antes = await page.evaluate("() => window.location.hash")

        el = page.get_by_text(texto, exact=True).first
        if await el.count() == 0:
            return None

        # Injecta listener de hashchange antes de clicar
        await page.evaluate("""() => {
            window.__hashChanged = false;
            window.__newHash = '';
            window.addEventListener('hashchange', function(e) {
                window.__hashChanged = true;
                window.__newHash = window.location.hash;
            }, {once: true});
        }""")

        await el.click(timeout=4000)
        await page.wait_for_timeout(1200)

        hash_depois = await page.evaluate("() => window.location.hash")
        mudou = hash_depois != hash_antes and hash_depois not in ("", "#/", "#")

        if mudou:
            return PORTAL_URL + "/" + hash_depois
        return None

    except (PWTimeout, Exception):
        return None


async def main():
    from playwright.async_api import async_playwright

    mapa: dict[str, str] = {}

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1366, "height": 900},
            locale="pt-BR"
        )

        print("Carregando portal...")
        await page.goto(PORTAL_URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(2000)

        # --- Passagem 1: menus top-level ---
        print(f"\nPassagem 1 — {len(MENUS_CONHECIDOS)} itens de menu...\n")
        for texto in MENUS_CONHECIDOS:
            # Recarrega home se necessário
            cur = await page.evaluate("() => window.location.hash")
            if cur not in ("", "#/", "#"):
                await page.goto(PORTAL_URL, wait_until="networkidle", timeout=20000)
                await page.wait_for_timeout(500)

            url = await clicar_e_capturar(page, texto)
            if url:
                mapa[texto] = url
                print(f"  ✓ {texto[:48]:<48} {url}")

        # --- Passagem 2: hover em cada item para revelar submenus ---
        print("\nPassagem 2 — expandindo submenus via hover...")
        await page.goto(PORTAL_URL, wait_until="networkidle", timeout=20000)
        await page.wait_for_timeout(1000)

        # Pega todos os elementos clicáveis visíveis
        els_data = await page.evaluate("""() => {
            const out = [];
            document.querySelectorAll('li, [role=menuitem], nav span, nav div').forEach(el => {
                const t = el.innerText?.trim().replace(/\\s+/g,' ') || '';
                const rect = el.getBoundingClientRect();
                if (t && t.length > 2 && t.length < 80 && rect.width > 0 && rect.height > 0) {
                    out.push(t);
                }
            });
            return [...new Set(out)].slice(0, 150);
        }""")

        novos = [t for t in els_data if t not in mapa and t not in MENUS_CONHECIDOS]
        print(f"  {len(novos)} elementos adicionais encontrados")

        for texto in novos[:80]:
            cur = await page.evaluate("() => window.location.hash")
            if cur not in ("", "#/", "#"):
                await page.goto(PORTAL_URL, wait_until="networkidle", timeout=15000)
                await page.wait_for_timeout(400)

            url = await clicar_e_capturar(page, texto)
            if url:
                mapa[texto] = url
                print(f"  + {texto[:48]:<48} {url}")

        await browser.close()

    # --- Resultado ---
    total = len(mapa)
    print(f"\n{total} URLs capturadas:\n")
    for k, v in sorted(mapa.items()):
        print(f"  {k[:48]:<48} {v}")

    Path("hrefs_portal.json").write_text(
        json.dumps({"gerado_em": datetime.now().isoformat(),
                    "total": total, "mapa": mapa},
                   ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"\nSalvo em hrefs_portal.json ({total} URLs)")


if __name__ == "__main__":
    asyncio.run(main())
