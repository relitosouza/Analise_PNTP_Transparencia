#!/usr/bin/env python3
"""
Mapeia TODAS as URLs do portal SMARAPD de Osasco navegando menu por menu.
Expande cada menu com hover e captura a URL de cada sub-item clicável.
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


async def mapear_urls():
    from playwright.async_api import async_playwright, TimeoutError as PWTimeout

    mapa: dict[str, str] = {}

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1366, "height": 900},
            locale="pt-BR",
        )
        page = await context.new_page()

        print("Carregando portal...")
        await page.goto(PORTAL_URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(2000)

        # 1. Captura todos os itens de menu top-level (nav links)
        menus_top = await page.evaluate("""() => {
            const sels = ['nav a', 'nav li', 'header a', '.menu-item', '[role=menuitem]',
                          '.navbar a', '.sidebar a', '.nav-link', 'ul.menu li'];
            const seen = new Set();
            const out = [];
            for (const sel of sels) {
                document.querySelectorAll(sel).forEach(el => {
                    const t = el.innerText?.trim().replace(/\\s+/g, ' ') || '';
                    if (t && t.length > 2 && t.length < 80 && !seen.has(t)) {
                        seen.add(t);
                        out.push(t);
                    }
                });
            }
            return out;
        }""")
        print(f"  {len(menus_top)} itens de menu encontrados")

        # 2. Para cada item, tenta hover + click e captura a URL
        for texto in menus_top:
            for tentativa in range(2):
                try:
                    await page.goto(PORTAL_URL, wait_until="networkidle", timeout=20000)
                    await page.wait_for_timeout(600)

                    el = page.get_by_text(texto, exact=True).first
                    if await el.count() == 0:
                        break

                    # Hover para revelar submenu
                    await el.hover(timeout=4000)
                    await page.wait_for_timeout(400)

                    # Verifica se apareceu submenu (novos itens visíveis)
                    submenu_items = await page.evaluate(f"""() => {{
                        const t = {json.dumps(texto)};
                        const out = [];
                        document.querySelectorAll('a, [role=menuitem], li').forEach(el => {{
                            const txt = el.innerText?.trim().replace(/\\s+/g, ' ') || '';
                            if (txt && txt.length > 2 && txt !== t &&
                                el.offsetParent !== null) {{
                                out.push(txt);
                            }}
                        }});
                        return out.slice(0, 30);
                    }}""")

                    # Clica no item
                    await el.click(timeout=5000)
                    await page.wait_for_timeout(1200)
                    url = page.url

                    if url and url != PORTAL_URL and url != PORTAL_URL + "/":
                        mapa[texto] = url
                        print(f"  ✓ {texto[:45]:<45} {url}")
                    else:
                        # Tenta sub-itens se voltou para home
                        mapa[texto] = PORTAL_URL + "/#/"
                    break

                except PWTimeout:
                    if tentativa == 1:
                        mapa[texto] = PORTAL_URL
                except Exception:
                    if tentativa == 1:
                        mapa[texto] = PORTAL_URL
                    await page.goto(PORTAL_URL, wait_until="networkidle", timeout=15000)

        # 3. Segunda passagem: navega diretamente aos sub-itens dos menus
        print("\n  Segunda passagem — submenus via hover sequencial...")
        await page.goto(PORTAL_URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(1500)

        # Captura todos os links depois de expandir todos os menus com hover
        await page.evaluate("""async () => {
            const els = document.querySelectorAll('nav li, .menu-item, [role=menuitem]');
            for (const el of els) {
                el.dispatchEvent(new MouseEvent('mouseover', {bubbles: true}));
                el.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
            }
        }""")
        await page.wait_for_timeout(800)

        # Captura todos os links visíveis com href ou onclick
        todos_links = await page.evaluate("""() => {
            const out = [];
            const seen = new Set();
            document.querySelectorAll('a').forEach(a => {
                const t = a.innerText?.trim().replace(/\\s+/g, ' ') || '';
                const h = a.href || '';
                if (t && h && !seen.has(t) && t.length > 2 && h.includes('#/')) {
                    seen.add(t);
                    out.push({text: t, href: h});
                }
            });
            return out;
        }""")

        print(f"  {len(todos_links)} links com href capturados")
        for lk in todos_links:
            if lk["text"] not in mapa or mapa[lk["text"]] == PORTAL_URL + "/#/":
                mapa[lk["text"]] = lk["href"]
                print(f"  + {lk['text'][:45]:<45} {lk['href']}")

        await browser.close()

    return mapa


async def main():
    print("=" * 65)
    print("  Mapeador de URLs — Portal Transparencia Osasco")
    print("=" * 65)

    mapa = await mapear_urls()

    # Filtra apenas os que têm URL específica (não apenas a home)
    mapa_util = {k: v for k, v in mapa.items()
                 if v and "#/" in v and v != PORTAL_URL + "/#/"}

    print(f"\n{len(mapa_util)} URLs especificas mapeadas de {len(mapa)} total")

    Path("urls_portal.json").write_text(
        json.dumps({"gerado_em": datetime.now().isoformat(),
                    "total": len(mapa),
                    "com_url_especifica": len(mapa_util),
                    "mapa_completo": mapa,
                    "mapa_util": mapa_util},
                   ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print("Salvo em urls_portal.json")

    print("\nURLs especificas encontradas:")
    for k, v in sorted(mapa_util.items()):
        print(f"  {k[:45]:<45} {v}")


if __name__ == "__main__":
    asyncio.run(main())
