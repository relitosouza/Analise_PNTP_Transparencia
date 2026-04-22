#!/usr/bin/env python3
"""
Analisador PNTP 2026 vs Portal da Transparência de Osasco
Compara os critérios da Cartilha PNTP 2026 (Atricon) com o que está
disponível no portal https://transparencia-osasco.smarapd.com.br

Requisitos:
    pip install playwright requests beautifulsoup4 reportlab
    python -m playwright install chromium
"""

import asyncio
import io
import json
import re
import sys

# Força UTF-8 no stdout/stderr do Windows (evita UnicodeEncodeError com emojis)
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

# ─── Critérios PNTP 2026 (Cartilha Atricon) ───────────────────────────────────

CRITERIOS_PNTP = [
    # ── DIMENSÃO 1: INFORMAÇÕES INSTITUCIONAIS ──
    {"id": "1.1",  "dimensao": "Informações Institucionais", "item": "Estrutura organizacional / Organograma", "peso": "essencial", "termos_busca": ["organograma", "estrutura organizacional", "estrutura administrativa"]},
    {"id": "1.2",  "dimensao": "Informações Institucionais", "item": "Competências do órgão / Atribuições", "peso": "essencial", "termos_busca": ["competências", "atribuições", "missão"]},
    {"id": "1.3",  "dimensao": "Informações Institucionais", "item": "Endereço e horários de funcionamento", "peso": "essencial", "termos_busca": ["endereço", "horário", "funcionamento", "contato"]},
    {"id": "1.4",  "dimensao": "Informações Institucionais", "item": "Legislação aplicável", "peso": "obrigatório", "termos_busca": ["legislação", "lei municipal", "decreto", "portaria"]},
    {"id": "1.5",  "dimensao": "Informações Institucionais", "item": "Agenda do gestor", "peso": "recomendado", "termos_busca": ["agenda", "agenda do prefeito", "agenda do gestor"]},
    {"id": "1.6",  "dimensao": "Informações Institucionais", "item": "Link para o Radar da Transparência (PNTP)", "peso": "obrigatório", "termos_busca": ["radar", "pntp", "atricon", "radar da transparência"]},
    {"id": "1.7",  "dimensao": "Informações Institucionais", "item": "Plano Plurianual (PPA)", "peso": "essencial", "termos_busca": ["ppa", "plano plurianual"]},
    {"id": "1.8",  "dimensao": "Informações Institucionais", "item": "Lei de Diretrizes Orçamentárias (LDO)", "peso": "essencial", "termos_busca": ["ldo", "lei de diretrizes orçamentárias", "diretrizes orçamentárias"]},
    {"id": "1.9",  "dimensao": "Informações Institucionais", "item": "Lei Orçamentária Anual (LOA)", "peso": "essencial", "termos_busca": ["loa", "lei orçamentária anual", "orçamento anual"]},

    # ── DIMENSÃO 2: RECEITAS ──
    {"id": "2.1",  "dimensao": "Receitas", "item": "Previsão e arrecadação de receitas", "peso": "essencial", "termos_busca": ["receita", "arrecadação", "previsão de receita"]},
    {"id": "2.2",  "dimensao": "Receitas", "item": "Receitas por categoria econômica", "peso": "essencial", "termos_busca": ["receita corrente", "receita de capital", "categoria econômica"]},
    {"id": "2.3",  "dimensao": "Receitas", "item": "Série histórica de receitas (≥3 anos)", "peso": "essencial", "termos_busca": ["histórico receita", "receitas anteriores", "exercício anterior"]},
    {"id": "2.4",  "dimensao": "Receitas", "item": "Transferências recebidas (FPM, FUNDEB etc.)", "peso": "obrigatório", "termos_busca": ["fpm", "fundeb", "transferências", "repasse federal", "repasse estadual"]},
    {"id": "2.5",  "dimensao": "Receitas", "item": "Receita por fonte de recursos", "peso": "obrigatório", "termos_busca": ["fonte de recurso", "fonte de recursos"]},

    # ── DIMENSÃO 3: DESPESAS ──
    {"id": "3.1",  "dimensao": "Despesas", "item": "Despesas por categoria/elemento/função", "peso": "essencial", "termos_busca": ["despesa", "elemento de despesa", "função"]},
    {"id": "3.2",  "dimensao": "Despesas", "item": "Empenhos, liquidações e pagamentos", "peso": "essencial", "termos_busca": ["empenho", "liquidação", "pagamento"]},
    {"id": "3.3",  "dimensao": "Despesas", "item": "Série histórica de despesas (≥3 anos)", "peso": "essencial", "termos_busca": ["histórico despesa", "despesas anteriores"]},
    {"id": "3.4",  "dimensao": "Despesas", "item": "Diárias e passagens", "peso": "essencial", "termos_busca": ["diária", "diárias", "passagem", "viagem"]},
    {"id": "3.5",  "dimensao": "Despesas", "item": "Despesas com cartão corporativo", "peso": "obrigatório", "termos_busca": ["cartão corporativo", "cartão de crédito"]},
    {"id": "3.6",  "dimensao": "Despesas", "item": "Execução orçamentária e financeira", "peso": "essencial", "termos_busca": ["execução orçamentária", "execução financeira"]},

    # ── DIMENSÃO 4: LICITAÇÕES E CONTRATOS ──
    {"id": "4.1",  "dimensao": "Licitações e Contratos", "item": "Editais de licitação", "peso": "essencial", "termos_busca": ["edital", "licitação", "pregão", "tomada de preços", "concorrência"]},
    {"id": "4.2",  "dimensao": "Licitações e Contratos", "item": "Resultado de licitações", "peso": "essencial", "termos_busca": ["resultado licitação", "homologação", "adjudicação"]},
    {"id": "4.3",  "dimensao": "Licitações e Contratos", "item": "Contratos e aditivos", "peso": "essencial", "termos_busca": ["contrato", "aditivo", "termo aditivo"]},
    {"id": "4.4",  "dimensao": "Licitações e Contratos", "item": "Dispensas e inexigibilidades", "peso": "essencial", "termos_busca": ["dispensa", "inexigibilidade", "dispensa de licitação"]},
    {"id": "4.5",  "dimensao": "Licitações e Contratos", "item": "Plano de Contratações Anual (PCA)", "peso": "obrigatório", "termos_busca": ["plano de contratações", "pca", "contratações anuais"]},
    {"id": "4.6",  "dimensao": "Licitações e Contratos", "item": "Atas de registro de preços", "peso": "obrigatório", "termos_busca": ["ata de registro", "registro de preços", "srp"]},

    # ── DIMENSÃO 5: RECURSOS HUMANOS ──
    {"id": "5.1",  "dimensao": "Recursos Humanos", "item": "Remuneração nominal dos servidores", "peso": "essencial", "termos_busca": ["remuneração", "salário", "vencimento", "servidor"]},
    {"id": "5.2",  "dimensao": "Recursos Humanos", "item": "Quadro de servidores efetivos e comissionados", "peso": "essencial", "termos_busca": ["quadro de servidores", "efetivos", "comissionados", "cargo comissionado"]},
    {"id": "5.3",  "dimensao": "Recursos Humanos", "item": "Concursos públicos", "peso": "obrigatório", "termos_busca": ["concurso", "concurso público", "processo seletivo"]},
    {"id": "5.4",  "dimensao": "Recursos Humanos", "item": "Estagiários", "peso": "recomendado", "termos_busca": ["estagiário", "estágio"]},
    {"id": "5.5",  "dimensao": "Recursos Humanos", "item": "Terceirizados / Contratos de mão de obra", "peso": "obrigatório", "termos_busca": ["terceirizado", "terceirização", "contrato de serviço"]},

    # ── DIMENSÃO 6: CONVÊNIOS E REPASSES ──
    {"id": "6.1",  "dimensao": "Convênios e Repasses", "item": "Convênios celebrados", "peso": "essencial", "termos_busca": ["convênio", "parceria", "termo de parceria"]},
    {"id": "6.2",  "dimensao": "Convênios e Repasses", "item": "Repasses a entidades privadas/OSC", "peso": "essencial", "termos_busca": ["repasse", "osc", "entidade privada", "subvenção"]},
    {"id": "6.3",  "dimensao": "Convênios e Repasses", "item": "Prestação de contas de convênios", "peso": "obrigatório", "termos_busca": ["prestação de contas", "relatório de execução"]},
    {"id": "6.4",  "dimensao": "Convênios e Repasses", "item": "Emendas parlamentares", "peso": "obrigatório", "termos_busca": ["emenda parlamentar", "emenda", "parlamentar"]},

    # ── DIMENSÃO 7: OBRAS ──
    {"id": "7.1",  "dimensao": "Obras", "item": "Obras em execução", "peso": "essencial", "termos_busca": ["obra", "obras", "construção", "reforma", "obras em andamento"]},
    {"id": "7.2",  "dimensao": "Obras", "item": "Contratos de obras com localização", "peso": "essencial", "termos_busca": ["contrato de obra", "localização obra", "endereço obra"]},

    # ── DIMENSÃO 8: SAÚDE ──
    {"id": "8.1",  "dimensao": "Saúde", "item": "Gastos com saúde", "peso": "essencial", "termos_busca": ["saúde", "gasto saúde", "despesa saúde"]},
    {"id": "8.2",  "dimensao": "Saúde", "item": "Repasses fundo a fundo saúde", "peso": "obrigatório", "termos_busca": ["fundo de saúde", "fundo municipal de saúde", "repasse saúde"]},

    # ── DIMENSÃO 9: EDUCAÇÃO ──
    {"id": "9.1",  "dimensao": "Educação", "item": "Gastos com educação / FUNDEB", "peso": "essencial", "termos_busca": ["educação", "fundeb", "ensino", "gasto educação"]},
    {"id": "9.2",  "dimensao": "Educação", "item": "Merenda escolar / alimentação", "peso": "obrigatório", "termos_busca": ["merenda", "alimentação escolar", "pnae"]},

    # ── DIMENSÃO 10: OUVIDORIA E LAI ──
    {"id": "10.1", "dimensao": "Ouvidoria e LAI", "item": "Canal de atendimento LAI / SIC online", "peso": "essencial", "termos_busca": ["e-sic", "sic", "lei de acesso", "lai", "pedido de informação"]},
    {"id": "10.2", "dimensao": "Ouvidoria e LAI", "item": "Ouvidoria municipal", "peso": "essencial", "termos_busca": ["ouvidoria", "manifestação", "reclamação", "denúncia"]},
    {"id": "10.3", "dimensao": "Ouvidoria e LAI", "item": "Estatísticas de pedidos de informação", "peso": "obrigatório", "termos_busca": ["estatística lai", "relatório lai", "pedidos respondidos"]},
    {"id": "10.4", "dimensao": "Ouvidoria e LAI", "item": "Rol de informações sigilosas", "peso": "obrigatório", "termos_busca": ["sigiloso", "sigilo", "informação classificada", "rol de informações"]},

    # ── DIMENSÃO 11: ACESSIBILIDADE E USABILIDADE ──
    {"id": "11.1", "dimensao": "Acessibilidade e Usabilidade", "item": "Barra de acessibilidade (contraste, fonte)", "peso": "essencial", "termos_busca": ["acessibilidade", "alto contraste", "libras", "vlibras"]},
    {"id": "11.2", "dimensao": "Acessibilidade e Usabilidade", "item": "Campo de busca/pesquisa no portal", "peso": "essencial", "termos_busca": ["busca", "pesquisa", "search", "localizar"]},
    {"id": "11.3", "dimensao": "Acessibilidade e Usabilidade", "item": "Mapa do site", "peso": "obrigatório", "termos_busca": ["mapa do site", "sitemap"]},
    {"id": "11.4", "dimensao": "Acessibilidade e Usabilidade", "item": "Dados em formato aberto (CSV/JSON/XML)", "peso": "obrigatório", "termos_busca": ["csv", "json", "xml", "dados abertos", "open data", "download"]},
    {"id": "11.5", "dimensao": "Acessibilidade e Usabilidade", "item": "Perguntas frequentes / FAQ", "peso": "recomendado", "termos_busca": ["faq", "perguntas frequentes", "dúvidas"]},
]

PORTAL_URL = "https://transparencia-osasco.smarapd.com.br"

# ─── Estrutura de resultado ────────────────────────────────────────────────────

@dataclass
class ResultadoCriterio:
    id: str
    dimensao: str
    item: str
    peso: str
    encontrado: bool = False
    url_encontrada: str = ""
    evidencia: str = ""
    termo_localizado: str = ""
    observacao: str = ""


# ─── Analisador Principal ──────────────────────────────────────────────────────

async def analisar_portal() -> list[ResultadoCriterio]:
    try:
        from playwright.async_api import async_playwright, TimeoutError as PWTimeout
    except ImportError:
        print("❌ Playwright não instalado. Execute:\n   pip install playwright\n   python -m playwright install chromium")
        sys.exit(1)

    resultados: list[ResultadoCriterio] = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1280, "height": 800},
            locale="pt-BR",
        )
        page = await context.new_page()

        # ── 1. Carrega página inicial e mapeia estrutura ──────────────────────
        print(f"\n🌐 Acessando {PORTAL_URL} ...")
        await page.goto(PORTAL_URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(2000)

        # Captura todos os links e textos visíveis na página inicial
        links_iniciais = await page.evaluate("""() => {
            const links = [];
            document.querySelectorAll('a, button, [role=menuitem], nav, .menu, .sidebar, header').forEach(el => {
                const text = el.innerText?.trim();
                const href = el.href || '';
                if (text && text.length > 2 && text.length < 200) {
                    links.push({ text, href });
                }
            });
            return links;
        }""")

        # Captura texto completo da página
        texto_pagina = await page.evaluate("() => document.body.innerText")
        print(f"   ✓ Página carregada — {len(texto_pagina)} chars, {len(links_iniciais)} elementos navegáveis")

        # Salva snapshot da estrutura inicial
        estrutura_inicial = {
            "url": PORTAL_URL,
            "timestamp": datetime.now().isoformat(),
            "links": links_iniciais[:100],
            "texto_amostra": texto_pagina[:3000],
        }
        Path("estrutura_portal.json").write_text(
            json.dumps(estrutura_inicial, ensure_ascii=False, indent=2), encoding="utf-8"
        )

        # ── 2. Testa campo de busca ───────────────────────────────────────────
        print("\n🔍 Localizando campo de busca do portal...")
        seletores_busca = [
            "input[type='search']",
            "input[placeholder*='busca' i]",
            "input[placeholder*='pesquisa' i]",
            "input[placeholder*='search' i]",
            "input[name*='search' i]",
            "input[name*='busca' i]",
            ".search-input",
            "#search",
            "#busca",
        ]
        campo_busca = None
        for sel in seletores_busca:
            try:
                el = page.locator(sel).first
                if await el.count() > 0:
                    campo_busca = el
                    print(f"   ✓ Campo de busca encontrado: {sel}")
                    break
            except Exception:
                continue

        if not campo_busca:
            print("   ⚠ Campo de busca não localizado pelos seletores padrão — tentando via aria/text...")
            try:
                campo_busca = page.get_by_role("searchbox").first
                if await campo_busca.count() == 0:
                    campo_busca = None
            except Exception:
                campo_busca = None

        # ── 3. Analisa cada critério PNTP ─────────────────────────────────────
        print(f"\n📋 Analisando {len(CRITERIOS_PNTP)} critérios PNTP 2026...\n")

        for criterio in CRITERIOS_PNTP:
            resultado = ResultadoCriterio(
                id=criterio["id"],
                dimensao=criterio["dimensao"],
                item=criterio["item"],
                peso=criterio["peso"],
            )

            # a) Verifica no texto da página inicial
            texto_lower = texto_pagina.lower()
            for termo in criterio["termos_busca"]:
                if termo.lower() in texto_lower:
                    resultado.encontrado = True
                    resultado.evidencia = "Encontrado na página inicial"
                    resultado.termo_localizado = termo
                    resultado.url_encontrada = PORTAL_URL
                    break

            # b) Verifica nos links da página inicial
            if not resultado.encontrado:
                for link in links_iniciais:
                    link_lower = link["text"].lower() + " " + link["href"].lower()
                    for termo in criterio["termos_busca"]:
                        if termo.lower() in link_lower:
                            resultado.encontrado = True
                            resultado.evidencia = f"Link: {link['text']}"
                            resultado.termo_localizado = termo
                            resultado.url_encontrada = link["href"] or PORTAL_URL
                            break
                    if resultado.encontrado:
                        break

            # c) Usa campo de busca para os não encontrados
            if not resultado.encontrado and campo_busca:
                for termo in criterio["termos_busca"][:2]:  # limita 2 termos por critério
                    try:
                        await campo_busca.click()
                        await campo_busca.fill("")
                        await campo_busca.fill(termo)
                        await page.keyboard.press("Enter")
                        await page.wait_for_timeout(1500)

                        # Verifica resultado
                        texto_busca = await page.evaluate("() => document.body.innerText")
                        links_busca = await page.evaluate("""() => {
                            return Array.from(document.querySelectorAll('a')).map(a => ({
                                text: a.innerText?.trim() || '',
                                href: a.href || ''
                            })).filter(l => l.text.length > 3);
                        }""")

                        # Checa se encontrou algo relevante (sem "nenhum resultado")
                        sem_resultado = any(x in texto_busca.lower() for x in [
                            "nenhum resultado", "não encontrado", "sem resultados",
                            "0 result", "no results"
                        ])

                        if not sem_resultado and termo.lower() in texto_busca.lower():
                            resultado.encontrado = True
                            resultado.evidencia = f"Encontrado via busca por '{termo}'"
                            resultado.termo_localizado = termo
                            resultado.url_encontrada = page.url
                            break

                        # Volta para a home entre buscas
                        await page.goto(PORTAL_URL, wait_until="networkidle", timeout=20000)
                        await page.wait_for_timeout(1000)

                        # Re-localiza campo de busca após navegação
                        for sel in seletores_busca:
                            try:
                                el = page.locator(sel).first
                                if await el.count() > 0:
                                    campo_busca = el
                                    break
                            except Exception:
                                continue

                    except PWTimeout:
                        resultado.observacao = "Timeout na busca"
                        break
                    except Exception as e:
                        resultado.observacao = f"Erro: {str(e)[:80]}"
                        break

            status = "✅" if resultado.encontrado else "❌"
            print(f"  {status} [{resultado.id}] {resultado.item[:55]:<55} | {resultado.peso}")
            resultados.append(resultado)

        await browser.close()

    return resultados


# ─── Geração do Relatório HTML ─────────────────────────────────────────────────

def gerar_relatorio_html(resultados: list[ResultadoCriterio], arquivo: str = "relatorio_pntp.html"):
    total = len(resultados)
    encontrados = sum(1 for r in resultados if r.encontrado)
    nao_encontrados = total - encontrados
    score = round((encontrados / total) * 100, 1)

    # Agrupa por dimensão
    dimensoes: dict[str, list[ResultadoCriterio]] = {}
    for r in resultados:
        dimensoes.setdefault(r.dimensao, []).append(r)

    # Score por dimensão
    def score_dim(itens):
        enc = sum(1 for i in itens if i.encontrado)
        return enc, len(itens), round(enc / len(itens) * 100) if itens else 0

    def cor_score(pct):
        if pct >= 80:
            return "#27ae60"
        if pct >= 50:
            return "#f39c12"
        return "#e74c3c"

    def badge_peso(peso):
        cores = {"essencial": "#e74c3c", "obrigatório": "#e67e22", "recomendado": "#3498db"}
        return f'<span style="background:{cores.get(peso,"#95a5a6")};color:#fff;padding:2px 7px;border-radius:10px;font-size:11px;font-weight:600">{peso.upper()}</span>'

    rows_dimensoes = ""
    for dim, itens in dimensoes.items():
        enc, tot, pct = score_dim(itens)
        cor = cor_score(pct)
        rows_dimensoes += f"""
        <tr>
          <td style="padding:8px 12px;font-weight:600">{dim}</td>
          <td style="padding:8px 12px;text-align:center">{tot}</td>
          <td style="padding:8px 12px;text-align:center;color:#27ae60;font-weight:700">{enc}</td>
          <td style="padding:8px 12px;text-align:center;color:#e74c3c;font-weight:700">{tot-enc}</td>
          <td style="padding:8px 12px">
            <div style="background:#ecf0f1;border-radius:6px;height:18px;width:100%">
              <div style="background:{cor};width:{pct}%;height:18px;border-radius:6px;min-width:2px"></div>
            </div>
            <small style="color:{cor};font-weight:700">{pct}%</small>
          </td>
        </tr>"""

    rows_detalhes = ""
    for r in resultados:
        bg = "#f0fff4" if r.encontrado else "#fff5f5"
        icon = "✅" if r.encontrado else "❌"
        evidencia = r.evidencia or "—"
        url_link = f'<a href="{r.url_encontrada}" target="_blank" style="color:#2980b9;font-size:12px">{r.url_encontrada[:60]}</a>' if r.url_encontrada else "—"
        rows_detalhes += f"""
        <tr style="background:{bg}">
          <td style="padding:8px 10px;text-align:center;font-size:16px">{icon}</td>
          <td style="padding:8px 10px;font-weight:600;color:#555">{r.id}</td>
          <td style="padding:8px 10px;color:#666;font-size:13px">{r.dimensao}</td>
          <td style="padding:8px 10px">{r.item}</td>
          <td style="padding:8px 10px;text-align:center">{badge_peso(r.peso)}</td>
          <td style="padding:8px 10px;font-size:12px;color:#555">{evidencia}</td>
          <td style="padding:8px 10px">{url_link}</td>
        </tr>"""

    # Itens críticos faltando (essenciais não encontrados)
    criticos = [r for r in resultados if not r.encontrado and r.peso == "essencial"]
    rows_criticos = ""
    for r in criticos:
        rows_criticos += f"<li><strong>[{r.id}]</strong> {r.item} <em>({r.dimensao})</em></li>"

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análise PNTP 2026 — Portal Transparência Osasco</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f9; color: #2c3e50; }}
    header {{ background: linear-gradient(135deg, #1a3c5e 0%, #2980b9 100%); color: white; padding: 30px 40px; }}
    header h1 {{ font-size: 26px; margin-bottom: 6px; }}
    header p {{ opacity: 0.85; font-size: 14px; }}
    .container {{ max-width: 1200px; margin: 0 auto; padding: 30px 20px; }}
    .cards {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 30px; }}
    .card {{ background: white; border-radius: 12px; padding: 22px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
    .card .num {{ font-size: 40px; font-weight: 800; margin-bottom: 4px; }}
    .card .lbl {{ font-size: 13px; color: #7f8c8d; font-weight: 500; }}
    .score-circle {{ display: inline-block; width: 90px; height: 90px; border-radius: 50%;
      background: conic-gradient({cor_score(score)} {score * 3.6}deg, #ecf0f1 0deg);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; }}
    .score-inner {{ width: 70px; height: 70px; border-radius: 50%; background: white;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
      font-weight: 800; color: {cor_score(score)}; }}
    .section {{ background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); }}
    .section h2 {{ font-size: 18px; margin-bottom: 18px; padding-bottom: 10px;
      border-bottom: 2px solid #ecf0f1; color: #1a3c5e; }}
    table {{ width: 100%; border-collapse: collapse; }}
    thead th {{ background: #1a3c5e; color: white; padding: 10px 12px; text-align: left; font-size: 13px; }}
    tbody tr:hover {{ filter: brightness(0.97); }}
    .alert {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px 20px;
      border-radius: 0 8px 8px 0; margin-bottom: 20px; }}
    .alert h3 {{ color: #856404; margin-bottom: 10px; }}
    .alert ul {{ padding-left: 20px; }}
    .alert li {{ margin-bottom: 6px; font-size: 14px; }}
    footer {{ text-align: center; padding: 20px; color: #95a5a6; font-size: 12px; margin-top: 20px; }}
  </style>
</head>
<body>
  <header>
    <h1>🔍 Análise PNTP 2026 — Portal da Transparência de Osasco</h1>
    <p>Comparativo entre a Cartilha PNTP 2026 (Atricon) e o conteúdo disponível em {PORTAL_URL}</p>
    <p>Gerado em: {datetime.now().strftime("%d/%m/%Y às %H:%M:%S")}</p>
  </header>

  <div class="container">

    <!-- KPIs -->
    <div class="cards">
      <div class="card">
        <div class="score-circle">
          <div class="score-inner">{score}%</div>
        </div>
        <div class="lbl">Score Geral PNTP</div>
      </div>
      <div class="card">
        <div class="num" style="color:#2c3e50">{total}</div>
        <div class="lbl">Critérios avaliados</div>
      </div>
      <div class="card">
        <div class="num" style="color:#27ae60">{encontrados}</div>
        <div class="lbl">Encontrados no portal</div>
      </div>
      <div class="card">
        <div class="num" style="color:#e74c3c">{nao_encontrados}</div>
        <div class="lbl">Não encontrados / Ausentes</div>
      </div>
      <div class="card">
        <div class="num" style="color:#e74c3c">{len(criticos)}</div>
        <div class="lbl">Essenciais em falta</div>
      </div>
    </div>

    <!-- Alerta críticos -->
    {"" if not criticos else f'''
    <div class="alert">
      <h3>⚠️ Itens ESSENCIAIS não encontrados ({len(criticos)})</h3>
      <ul>{rows_criticos}</ul>
    </div>'''}

    <!-- Resumo por dimensão -->
    <div class="section">
      <h2>📊 Resultado por Dimensão</h2>
      <table>
        <thead>
          <tr>
            <th>Dimensão</th><th>Total</th><th>Encontrados</th><th>Ausentes</th><th>Progresso</th>
          </tr>
        </thead>
        <tbody>{rows_dimensoes}</tbody>
      </table>
    </div>

    <!-- Detalhamento completo -->
    <div class="section">
      <h2>📋 Detalhamento Completo dos Critérios</h2>
      <table>
        <thead>
          <tr>
            <th>Status</th><th>ID</th><th>Dimensão</th><th>Item PNTP</th>
            <th>Classificação</th><th>Evidência</th><th>URL</th>
          </tr>
        </thead>
        <tbody>{rows_detalhes}</tbody>
      </table>
    </div>

    <!-- Metodologia -->
    <div class="section">
      <h2>📖 Metodologia</h2>
      <p style="line-height:1.7;font-size:14px">
        Esta análise foi realizada de forma automatizada utilizando <strong>Playwright</strong> para renderização
        do portal JavaScript (SPA). Para cada um dos <strong>{total} critérios PNTP 2026</strong>, o script:
        <ol style="padding-left:20px;margin-top:10px;line-height:2">
          <li>Verifica o texto completo da página inicial do portal;</li>
          <li>Analisa todos os links e elementos de navegação visíveis;</li>
          <li>Utiliza o <strong>campo de busca</strong> do portal para pesquisar cada termo;</li>
          <li>Registra a evidência e a URL onde o item foi localizado.</li>
        </ol>
        <br>
        <strong>Pesos PNTP 2026:</strong> Atualidade 40% · Integralidade 40% · Série Histórica 20%<br>
        <strong>Fonte:</strong> <a href="https://radardatransparencia.atricon.org.br/pdf/Cartilha-PNTP-2026.pdf" target="_blank">Cartilha PNTP 2026 — Atricon</a>
      </p>
    </div>

  </div>
  <footer>
    Script gerado por Claude Code · Dados do portal: {PORTAL_URL} · Cartilha: radardatransparencia.atricon.org.br
  </footer>
</body>
</html>"""

    Path(arquivo).write_text(html, encoding="utf-8")
    print(f"\n📄 Relatório HTML gerado: {arquivo}")


# ─── Geração do Relatório JSON ─────────────────────────────────────────────────

def gerar_relatorio_json(resultados: list[ResultadoCriterio], arquivo: str = "relatorio_pntp.json"):
    total = len(resultados)
    encontrados = sum(1 for r in resultados if r.encontrado)

    payload = {
        "meta": {
            "portal": PORTAL_URL,
            "cartilha": "PNTP 2026 — Atricon",
            "gerado_em": datetime.now().isoformat(),
            "total_criterios": total,
            "encontrados": encontrados,
            "ausentes": total - encontrados,
            "score_percentual": round(encontrados / total * 100, 1),
        },
        "resultados": [asdict(r) for r in resultados],
    }
    Path(arquivo).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"📊 Relatório JSON gerado: {arquivo}")


# ─── Modo Offline / Fallback sem Playwright ───────────────────────────────────

def analisar_offline():
    """
    Quando Playwright não está disponível, gera o relatório com os critérios
    marcados como 'não verificado' para revisão manual.
    """
    print("\n⚠️  Modo offline — marcando todos os itens como 'não verificado'")
    print("   Para análise completa, instale Playwright e execute novamente.\n")
    resultados = []
    for c in CRITERIOS_PNTP:
        r = ResultadoCriterio(
            id=c["id"],
            dimensao=c["dimensao"],
            item=c["item"],
            peso=c["peso"],
            encontrado=False,
            observacao="Verificação manual necessária",
        )
        resultados.append(r)
    return resultados


# ─── Entry Point ───────────────────────────────────────────────────────────────

async def main():
    print("=" * 65)
    print("  PNTP 2026 × Portal Transparência Osasco — Analisador Automático")
    print("=" * 65)
    print(f"  Portal:   {PORTAL_URL}")
    print(f"  Critérios: {len(CRITERIOS_PNTP)} itens PNTP 2026")
    print(f"  Data:     {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 65)

    try:
        resultados = await analisar_portal()
    except SystemExit:
        resultados = analisar_offline()
    except Exception as e:
        print(f"\n⚠️  Erro durante análise: {e}")
        print("   Gerando relatório em modo offline...")
        resultados = analisar_offline()

    # Gera relatórios
    gerar_relatorio_html(resultados, "relatorio_pntp.html")
    gerar_relatorio_json(resultados, "relatorio_pntp.json")

    # Resumo final no terminal
    total = len(resultados)
    enc = sum(1 for r in resultados if r.encontrado)
    criticos = [r for r in resultados if not r.encontrado and r.peso == "essencial"]

    print("\n" + "=" * 65)
    print(f"  RESULTADO FINAL")
    print(f"  Score: {round(enc/total*100,1)}%  ({enc}/{total} critérios encontrados)")
    print(f"  Essenciais em falta: {len(criticos)}")
    print("=" * 65)
    if criticos:
        print("\n  ⚠️  Itens ESSENCIAIS ausentes:")
        for r in criticos:
            print(f"     • [{r.id}] {r.item}")
    print("\n  Arquivos gerados:")
    print("     📄 relatorio_pntp.html  — Abra no navegador para ver o relatório completo")
    print("     📊 relatorio_pntp.json  — Dados estruturados para integração")
    print("     🗂️  estrutura_portal.json — Snapshot da estrutura do portal")
    print()


if __name__ == "__main__":
    asyncio.run(main())
