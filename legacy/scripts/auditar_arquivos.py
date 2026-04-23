#!/usr/bin/env python3
"""
Mapeador Granular de Documentos e Arquivos — Portal Transparência Osasco
Versão Corrigida: Navega especificamente nas seções dinâmicas de Licitações.
"""

import asyncio
import io
import json
import sys
from datetime import datetime
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

PORTAL_URL = "https://transparencia-osasco.smarapd.com.br"

# Seções alvo para auditoria de arquivos (URLs dinâmicas baseadas na descoberta do browser subagent)
TARGET_SECTIONS = {
    "Licitações": "#/dinamico/licitacoes_em_andamento/Licitacoes",
    "Contratos": "#/dinamico/compras_contratos_contratos/Contratos",
    "Dispensas/Inexig": "#/dinamico/licitacoes_dispensa_inexigibilidade/Licitacoes",
}

async def mapear_arquivos_licitacao(page, section_name, hash_url):
    print(f"\n🔍 Auditando arquivos na seção: {section_name}")
    results = {
        "secao": section_name,
        "url_base": f"{PORTAL_URL}/{hash_url}",
        "itens_auditados": [],
        "possui_arquivos": False,
        "detalhes": ""
    }

    try:
        await page.goto(f"{PORTAL_URL}/{hash_url}", wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(5000) # Espera renderização da tabela dinâmica

        # 1. Verifica se existe coluna "Anexos" ou similar
        # No Ant Design do portal, as colunas podem ser detectadas pelo texto dos THs
        colunas = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('.ant-table-thead th'))
                .map(th => th.innerText.trim())
                .filter(t => t.length > 0);
        }""")
        
        print(f"   Colunas encontradas: {', '.join(colunas)}")
        
        # 2. Busca pelo ícone de anexo (comumente i.fa-file-text-o ou similar no portal)
        # O browser subagent viu que o clique abre um modal
        await page.evaluate("""() => {
            const icons = Array.from(document.querySelectorAll('i.fa-file-text-o, i.fa-paperclip, .ant-btn-icon-only i'));
            if (icons.length > 0) {
                icons[0].click(); // Abre o primeiro anexo da lista
            }
        }""")
        
        await page.wait_for_timeout(3000)
        
        # 3. Verifica documentos no modal de anexos
        docs_modal = await page.evaluate("""() => {
            const modal = document.querySelector('.ant-modal-content');
            if (!modal) return [];
            const links = Array.from(modal.querySelectorAll('a, button'));
            return links
                .map(el => ({
                    text: el.innerText.trim() || el.getAttribute('title') || 'Arquivo',
                    url: el.tagName === 'A' ? el.href : ''
                }))
                .filter(l => l.text.toUpperCase().includes('PDF') || l.text.toUpperCase().includes('EDITAL') || l.text.toUpperCase().includes('AVISO'));
        }""")
        
        if docs_modal:
            results["possui_arquivos"] = True
            results["itens_auditados"] = docs_modal
            print(f"   ✅ Encontrados {len(docs_modal)} documentos no modal de anexos.")
        else:
            # Tenta verificar se a coluna "Anexos" tem conteúdo
            print("   ⚠️ Nenhum documento listado no modal ou modal não abriu.")

    except Exception as e:
        print(f"   ❌ Erro ao auditar {section_name}: {str(e)[:100]}")
        results["detalhes"] = f"Erro: {str(e)}"

    return results

async def main():
    from playwright.async_api import async_playwright

    print("=" * 65)
    print("  Auditoria de Arquivos e Documentos (Deep Scan) — Osasco")
    print("=" * 65)

    auditoria_final = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1366, "height": 900}
        )
        page = await context.new_page()

        for nome, hash_path in TARGET_SECTIONS.items():
            res = await mapear_arquivos_licitacao(page, nome, hash_path)
            auditoria_final.append(res)

        await browser.close()

    # Salva resultado
    output_path = Path("auditoria_arquivos.json")
    output_path.write_text(
        json.dumps({
            "gerado_em": datetime.now().isoformat(),
            "resultados": auditoria_final
        }, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"\n✅ Auditoria concluída. Resultados salvos em {output_path}")

if __name__ == "__main__":
    asyncio.run(main())
