#!/usr/bin/env python3
"""
Gera o relatório HTML final PNTP 2026 x Portal Transparência Osasco
com ID, seção da cartilha, resposta do portal e URL completa.
"""
import io, json, sys
from datetime import datetime
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

PORTAL  = "https://transparencia-osasco.smarapd.com.br"
CARTILHA = "https://radardatransparencia.atricon.org.br/pdf/Cartilha-PNTP-2026.pdf"

# ── URLs reais capturadas do portal ──────────────────────────────────────────
URLS_PORTAL = {
    "portal_inicio"         : f"{PORTAL}/#/fixo/portal/inicio",
    "dados_abertos"         : f"{PORTAL}/#/dados_abertos",
    "pecas_contabeis"       : f"{PORTAL}/#/fixo/loa/pecascontabeis",
    "estatisticas"          : f"{PORTAL}/#/estatisticas",
    "emendas_parlamentares" : f"{PORTAL}/#/dinamico/66/EmendasParlamentares",
    "audiencias_publicas"   : f"{PORTAL}/#/fixo/audiencias_publicas/audienciaspublicas",
    "repasses_educacao"     : f"{PORTAL}/#/dinamico/despesa_educacao/Repasses",
    "concessoes"            : f"{PORTAL}/#/fixo/pca/Concessoes",
    "home"                  : f"{PORTAL}/#/",
}

# ── Dados completos de cada critério ─────────────────────────────────────────
# encontrado / evidencia / termo vêm do relatorio_pntp.json
resultados_json = json.loads(Path("relatorio_pntp.json").read_text(encoding="utf-8"))
res_map = {r["id"]: r for r in resultados_json["resultados"]}

CRITERIOS = [
    # ── Informações Institucionais ──
    dict(id="1.1", peso="essencial", dimensao="Informacoes Institucionais",
         item="Estrutura organizacional / Organograma",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.1 — Organograma da entidade",
         nav_portal="Menu: Administracao Publica > Organograma",
         url_key="home",
         obs_ausencia="Organograma nao localizado no portal. Verificar em Administracao Publica."),

    dict(id="1.2", peso="essencial", dimensao="Informacoes Institucionais",
         item="Competencias e atribuicoes do orgao",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.2 — Competencias e estrutura organizacional",
         nav_portal="Menu: Administracao Publica > Competencias",
         url_key="home",
         obs_ausencia="Nao localizado. Verificar em Administracao Publica."),

    dict(id="1.3", peso="essencial", dimensao="Informacoes Institucionais",
         item="Endereco e horarios de atendimento",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.3 — Endereco e horarios de funcionamento",
         nav_portal="Pagina inicial do portal",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="1.4", peso="obrigatorio", dimensao="Informacoes Institucionais",
         item="Legislacao aplicavel",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.4 — Normas e legislacao do orgao",
         nav_portal="Menu: Legislacao e Imprensa Oficial do Municipio",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="1.5", peso="recomendado", dimensao="Informacoes Institucionais",
         item="Agenda do gestor",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.5 — Agenda da autoridade maxima",
         nav_portal="Menu: Administracao Publica > Agenda do Prefeito",
         url_key="home",
         obs_ausencia="Agenda do gestor nao identificada no portal."),

    dict(id="1.6", peso="obrigatorio", dimensao="Informacoes Institucionais",
         item="Link para o Radar da Transparencia (PNTP)",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.6 — Link direto ao Radar da Transparencia Publica",
         nav_portal="Deve estar em: Sobre o Portal > Avaliacoes sobre Transparencia",
         url_key="portal_inicio",
         obs_ausencia="Link para radardatransparencia.atricon.org.br nao encontrado."),

    dict(id="1.7", peso="essencial", dimensao="Informacoes Institucionais",
         item="Plano Plurianual (PPA)",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.7 — Instrumento de planejamento: PPA",
         nav_portal="Menu: Pecas Orcamentarias > PPA",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="1.8", peso="essencial", dimensao="Informacoes Institucionais",
         item="Lei de Diretrizes Orcamentarias (LDO)",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.8 — Instrumento de planejamento: LDO",
         nav_portal="Menu: Pecas Orcamentarias > LDO",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="1.9", peso="essencial", dimensao="Informacoes Institucionais",
         item="Lei Orcamentaria Anual (LOA)",
         cartilha_grupo="Grupo 1 — Informacoes Institucionais",
         cartilha_criterio="Criterio 1.9 — Instrumento de planejamento: LOA",
         nav_portal="Menu: Pecas Orcamentarias > LOA | Pecas Contabeis",
         url_key="pecas_contabeis",
         obs_ausencia=""),

    # ── Receitas ──
    dict(id="2.1", peso="essencial", dimensao="Receitas",
         item="Previsao e arrecadacao de receitas",
         cartilha_grupo="Grupo 2 — Receitas",
         cartilha_criterio="Criterio 2.1 — Receitas previstas e arrecadadas",
         nav_portal="Menu: Contas Publicas > Receitas > Receita Analitica",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="2.2", peso="essencial", dimensao="Receitas",
         item="Receitas por categoria economica",
         cartilha_grupo="Grupo 2 — Receitas",
         cartilha_criterio="Criterio 2.2 — Classificacao por categoria economica",
         nav_portal="Menu: Contas Publicas > Receitas > Receita Corrente / Receita Capital",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="2.3", peso="essencial", dimensao="Receitas",
         item="Serie historica de receitas (minimo 3 anos)",
         cartilha_grupo="Grupo 2 — Receitas",
         cartilha_criterio="Criterio 2.3 — Serie historica de receitas (>=3 anos)",
         nav_portal="Menu: Contas Publicas > Receitas (filtro por exercicio anterior)",
         url_key="estatisticas",
         obs_ausencia="Serie historica de receitas por exercicio nao localizada. Verificar filtros de ano nas telas de receita."),

    dict(id="2.4", peso="obrigatorio", dimensao="Receitas",
         item="Transferencias recebidas (FPM, FUNDEB etc.)",
         cartilha_grupo="Grupo 2 — Receitas",
         cartilha_criterio="Criterio 2.4 — Transferencias intergovernamentais recebidas",
         nav_portal="Menu: Contas Publicas > Repasses e Transferencias | Receita Arrecadada Transf. Constitucionais",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="2.5", peso="obrigatorio", dimensao="Receitas",
         item="Receita por fonte de recursos",
         cartilha_grupo="Grupo 2 — Receitas",
         cartilha_criterio="Criterio 2.5 — Receitas por fonte de recursos",
         nav_portal="Menu: Contas Publicas > Despesa Por Fonte de Recurso",
         url_key="portal_inicio",
         obs_ausencia=""),

    # ── Despesas ──
    dict(id="3.1", peso="essencial", dimensao="Despesas",
         item="Despesas por categoria / elemento / funcao",
         cartilha_grupo="Grupo 3 — Despesas",
         cartilha_criterio="Criterio 3.1 — Despesas por classificacao orcamentaria",
         nav_portal="Menu: Contas Publicas > Despesas > Despesas Filtradas / Sinteticas",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="3.2", peso="essencial", dimensao="Despesas",
         item="Empenhos, liquidacoes e pagamentos",
         cartilha_grupo="Grupo 3 — Despesas",
         cartilha_criterio="Criterio 3.2 — Estagios da despesa (empenho/liquidacao/pagamento)",
         nav_portal="Menu: Contas Publicas > Empenhos / Financeiro",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="3.3", peso="essencial", dimensao="Despesas",
         item="Serie historica de despesas (minimo 3 anos)",
         cartilha_grupo="Grupo 3 — Despesas",
         cartilha_criterio="Criterio 3.3 — Serie historica de despesas (>=3 anos)",
         nav_portal="Menu: Contas Publicas > Despesas (filtro de exercicio)",
         url_key="estatisticas",
         obs_ausencia="Serie historica de despesas por exercicio nao localizada."),

    dict(id="3.4", peso="essencial", dimensao="Despesas",
         item="Diarias e passagens",
         cartilha_grupo="Grupo 3 — Despesas",
         cartilha_criterio="Criterio 3.4 — Gastos com diarias e passagens",
         nav_portal="Menu: Contas Publicas > Despesas > Despesas com Viagens",
         url_key="home",
         obs_ausencia="Diarias e passagens nao encontradas. A secao 'Despesas com Viagens' existe no menu mas nao retornou resultados na busca."),

    dict(id="3.5", peso="obrigatorio", dimensao="Despesas",
         item="Despesas com cartao corporativo",
         cartilha_grupo="Grupo 3 — Despesas",
         cartilha_criterio="Criterio 3.5 — Gastos com cartao corporativo",
         nav_portal="Nao identificado no portal",
         url_key="home",
         obs_ausencia="Secao de cartao corporativo nao encontrada no portal."),

    dict(id="3.6", peso="essencial", dimensao="Despesas",
         item="Execucao orcamentaria e financeira",
         cartilha_grupo="Grupo 3 — Despesas",
         cartilha_criterio="Criterio 3.6 — Execucao orcamentaria consolidada",
         nav_portal="Menu: Contas Publicas > Decretos de Execucao Orcamentaria | Relatorios LRF",
         url_key="pecas_contabeis",
         obs_ausencia=""),

    # ── Licitacoes e Contratos ──
    dict(id="4.1", peso="essencial", dimensao="Licitacoes e Contratos",
         item="Editais de licitacao",
         cartilha_grupo="Grupo 4 — Licitacoes e Contratos",
         cartilha_criterio="Criterio 4.1 — Editais de licitacao publicados",
         nav_portal="Menu: Licitacoes e Contratos > Editais / Avisos",
         url_key="home",
         obs_ausencia="Editais nao localizados via busca. O menu 'Licitacoes e Contratos' existe mas nao respondeu ao termo 'edital'."),

    dict(id="4.2", peso="essencial", dimensao="Licitacoes e Contratos",
         item="Resultado de licitacoes",
         cartilha_grupo="Grupo 4 — Licitacoes e Contratos",
         cartilha_criterio="Criterio 4.2 — Resultados e homologacoes de licitacao",
         nav_portal="Menu: Licitacoes e Contratos > Resultados / Homologacoes",
         url_key="home",
         obs_ausencia="Resultados de licitacoes nao localizados via busca."),

    dict(id="4.3", peso="essencial", dimensao="Licitacoes e Contratos",
         item="Contratos e aditivos",
         cartilha_grupo="Grupo 4 — Licitacoes e Contratos",
         cartilha_criterio="Criterio 4.3 — Contratos firmados e termos aditivos",
         nav_portal="Menu: Licitacoes e Contratos > Contratos / Termos Aditivos",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="4.4", peso="essencial", dimensao="Licitacoes e Contratos",
         item="Dispensas e inexigibilidades",
         cartilha_grupo="Grupo 4 — Licitacoes e Contratos",
         cartilha_criterio="Criterio 4.4 — Contratacoes diretas (dispensa/inexigibilidade)",
         nav_portal="Menu: Licitacoes e Contratos > Dispensas / Inexigibilidades",
         url_key="home",
         obs_ausencia="Dispensas e inexigibilidades nao localizadas. Verificar submenu de Licitacoes."),

    dict(id="4.5", peso="obrigatorio", dimensao="Licitacoes e Contratos",
         item="Plano de Contratacoes Anual (PCA)",
         cartilha_grupo="Grupo 4 — Licitacoes e Contratos",
         cartilha_criterio="Criterio 4.5 — Plano de Contratacoes Anual (PCA)",
         nav_portal="Nao identificado no portal (possivel: Licitacoes > PCA)",
         url_key="concessoes",
         obs_ausencia="PCA nao localizado. O portal tem secao de Concessoes mas nao de PCA especifico."),

    dict(id="4.6", peso="obrigatorio", dimensao="Licitacoes e Contratos",
         item="Atas de registro de precos",
         cartilha_grupo="Grupo 4 — Licitacoes e Contratos",
         cartilha_criterio="Criterio 4.6 — Atas de registro de precos publicadas",
         nav_portal="Menu: Licitacoes e Contratos > Atas de Registro de Precos",
         url_key="home",
         obs_ausencia="Atas de registro de precos nao localizadas via busca."),

    # ── Recursos Humanos ──
    dict(id="5.1", peso="essencial", dimensao="Recursos Humanos",
         item="Remuneracao nominal dos servidores",
         cartilha_grupo="Grupo 5 — Recursos Humanos",
         cartilha_criterio="Criterio 5.1 — Remuneracao nominal individualizada",
         nav_portal="Menu: Gestao de Pessoas > Remuneracao / Servidores",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="5.2", peso="essencial", dimensao="Recursos Humanos",
         item="Quadro de servidores efetivos e comissionados",
         cartilha_grupo="Grupo 5 — Recursos Humanos",
         cartilha_criterio="Criterio 5.2 — Quadro de pessoal por vinculo",
         nav_portal="Menu: Gestao de Pessoas > Quadro de Servidores",
         url_key="home",
         obs_ausencia="Quadro de servidores por vinculo (efetivo/comissionado) nao localizado."),

    dict(id="5.3", peso="obrigatorio", dimensao="Recursos Humanos",
         item="Concursos publicos e processos seletivos",
         cartilha_grupo="Grupo 5 — Recursos Humanos",
         cartilha_criterio="Criterio 5.3 — Concursos e processos seletivos vigentes",
         nav_portal="Menu: Concursos e Processos Seletivos > Proximos ou Abertos",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="5.4", peso="recomendado", dimensao="Recursos Humanos",
         item="Estagiarios",
         cartilha_grupo="Grupo 5 — Recursos Humanos",
         cartilha_criterio="Criterio 5.4 — Relacao de estagiarios contratados",
         nav_portal="Menu: Gestao de Pessoas > Estagiarios",
         url_key="home",
         obs_ausencia="Estagiarios nao identificados no portal."),

    dict(id="5.5", peso="obrigatorio", dimensao="Recursos Humanos",
         item="Terceirizados / Contratos de mao de obra",
         cartilha_grupo="Grupo 5 — Recursos Humanos",
         cartilha_criterio="Criterio 5.5 — Trabalhadores terceirizados",
         nav_portal="Nao identificado no portal",
         url_key="home",
         obs_ausencia="Secao de terceirizados nao encontrada."),

    # ── Convenios e Repasses ──
    dict(id="6.1", peso="essencial", dimensao="Convenios e Repasses",
         item="Convenios celebrados",
         cartilha_grupo="Grupo 6 — Convenios e Repasses",
         cartilha_criterio="Criterio 6.1 — Convenios firmados com detalhamento",
         nav_portal="Menu: Terceiro Setor > Convenios / Convenios de Cooperacao",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="6.2", peso="essencial", dimensao="Convenios e Repasses",
         item="Repasses a entidades privadas / OSC",
         cartilha_grupo="Grupo 6 — Convenios e Repasses",
         cartilha_criterio="Criterio 6.2 — Repasses e subvencoes a OSC/entidades",
         nav_portal="Menu: Terceiro Setor | Repasses Mundo da Crianca",
         url_key="repasses_educacao",
         obs_ausencia=""),

    dict(id="6.3", peso="obrigatorio", dimensao="Convenios e Repasses",
         item="Prestacao de contas de convenios",
         cartilha_grupo="Grupo 6 — Convenios e Repasses",
         cartilha_criterio="Criterio 6.3 — Prestacao de contas dos convenios",
         nav_portal="Menu: Contas Publicas > Prestacao de Contas",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="6.4", peso="obrigatorio", dimensao="Convenios e Repasses",
         item="Emendas parlamentares recebidas",
         cartilha_grupo="Grupo 6 — Convenios e Repasses",
         cartilha_criterio="Criterio 6.4 — Emendas parlamentares recebidas e aplicadas",
         nav_portal="Menu: Emendas Parlamentares > Emendas Estadual e Federal",
         url_key="emendas_parlamentares",
         obs_ausencia=""),

    # ── Obras ──
    dict(id="7.1", peso="essencial", dimensao="Obras",
         item="Obras em execucao",
         cartilha_grupo="Grupo 7 — Obras Publicas",
         cartilha_criterio="Criterio 7.1 — Obras em andamento com informacoes basicas",
         nav_portal="Menu: Projetos e Obras",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="7.2", peso="essencial", dimensao="Obras",
         item="Contratos de obras com localizacao",
         cartilha_grupo="Grupo 7 — Obras Publicas",
         cartilha_criterio="Criterio 7.2 — Localizacao e andamento percentual das obras",
         nav_portal="Menu: Projetos e Obras > Mapa/Localizacao",
         url_key="home",
         obs_ausencia="Localizacao geografica das obras (mapa/endereco) nao localizada."),

    # ── Saude ──
    dict(id="8.1", peso="essencial", dimensao="Saude",
         item="Gastos com saude",
         cartilha_grupo="Grupo 8 — Saude",
         cartilha_criterio="Criterio 8.1 — Despesas com a funcao saude",
         nav_portal="Menu: Contas Publicas > Despesas (filtro: funcao Saude)",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="8.2", peso="obrigatorio", dimensao="Saude",
         item="Repasses fundo a fundo saude",
         cartilha_grupo="Grupo 8 — Saude",
         cartilha_criterio="Criterio 8.2 — Transferencias fundo a fundo (Saude)",
         nav_portal="Menu: Contas Publicas > Receitas > Receitas Arrecadadas de Fundos Municipais",
         url_key="home",
         obs_ausencia="Repasses fundo a fundo de saude nao localizados especificamente."),

    # ── Educacao ──
    dict(id="9.1", peso="essencial", dimensao="Educacao",
         item="Gastos com educacao / FUNDEB",
         cartilha_grupo="Grupo 9 — Educacao",
         cartilha_criterio="Criterio 9.1 — Despesas com educacao e FUNDEB",
         nav_portal="Menu: Contas Publicas > Despesas (FUNDEB) | Cacs-Fundeb",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="9.2", peso="obrigatorio", dimensao="Educacao",
         item="Merenda escolar / alimentacao (PNAE)",
         cartilha_grupo="Grupo 9 — Educacao",
         cartilha_criterio="Criterio 9.2 — Programa Nacional de Alimentacao Escolar (PNAE)",
         nav_portal="Nao identificado no portal",
         url_key="home",
         obs_ausencia="Informacoes sobre merenda/alimentacao escolar nao encontradas."),

    # ── Ouvidoria e LAI ──
    dict(id="10.1", peso="essencial", dimensao="Ouvidoria e LAI",
         item="Canal de atendimento LAI / e-SIC online",
         cartilha_grupo="Grupo 10 — Transparencia Passiva (LAI)",
         cartilha_criterio="Criterio 10.1 — Servico de Informacao ao Cidadao (e-SIC)",
         nav_portal="Menu: Ouvidoria Geral / Fala Cidadao > Acesso ao e-SIC",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="10.2", peso="essencial", dimensao="Ouvidoria e LAI",
         item="Ouvidoria municipal",
         cartilha_grupo="Grupo 10 — Transparencia Passiva (LAI)",
         cartilha_criterio="Criterio 10.2 — Canal de ouvidoria ativa",
         nav_portal="Menu: Ouvidoria Geral | Fala Cidadao | Central 156",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="10.3", peso="obrigatorio", dimensao="Ouvidoria e LAI",
         item="Estatisticas de pedidos de informacao",
         cartilha_grupo="Grupo 10 — Transparencia Passiva (LAI)",
         cartilha_criterio="Criterio 10.3 — Relatorio estatistico de atendimentos LAI",
         nav_portal="Menu: Estatisticas (verificar se inclui dados LAI)",
         url_key="estatisticas",
         obs_ausencia="Estatisticas especificas de pedidos LAI nao localizadas."),

    dict(id="10.4", peso="obrigatorio", dimensao="Ouvidoria e LAI",
         item="Rol de informacoes sigilosas",
         cartilha_grupo="Grupo 10 — Transparencia Passiva (LAI)",
         cartilha_criterio="Criterio 10.4 — Rol de informacoes classificadas como sigilosas",
         nav_portal="Nao identificado no portal",
         url_key="home",
         obs_ausencia="Rol de informacoes sigilosas nao encontrado."),

    # ── Acessibilidade e Usabilidade ──
    dict(id="11.1", peso="essencial", dimensao="Acessibilidade e Usabilidade",
         item="Barra de acessibilidade (contraste, fonte, VLibras)",
         cartilha_grupo="Grupo 11 — Acessibilidade",
         cartilha_criterio="Criterio 11.1 — Recursos de acessibilidade digital",
         nav_portal="Barra superior do portal (AA+ A-)",
         url_key="portal_inicio",
         obs_ausencia=""),

    dict(id="11.2", peso="essencial", dimensao="Acessibilidade e Usabilidade",
         item="Campo de busca / pesquisa no portal",
         cartilha_grupo="Grupo 11 — Acessibilidade",
         cartilha_criterio="Criterio 11.2 — Ferramenta de busca funcional e indexada",
         nav_portal="Topo esquerdo do portal (input[type=search])",
         url_key="portal_inicio",
         obs_ausencia="O campo de busca existe (input[type=search]) mas nao retornou resultados nos termos testados — possivel problema de indexacao."),

    dict(id="11.3", peso="obrigatorio", dimensao="Acessibilidade e Usabilidade",
         item="Mapa do site (Sumario)",
         cartilha_grupo="Grupo 11 — Acessibilidade",
         cartilha_criterio="Criterio 11.3 — Mapa do site (sitemap navegavel)",
         nav_portal="Menu: Sobre o Portal > Sumario",
         url_key="portal_inicio",
         obs_ausencia="Sumario/mapa do site existe no menu mas nao foi localizado via busca."),

    dict(id="11.4", peso="obrigatorio", dimensao="Acessibilidade e Usabilidade",
         item="Dados em formato aberto (CSV / JSON / XML)",
         cartilha_grupo="Grupo 11 — Acessibilidade",
         cartilha_criterio="Criterio 11.4 — Dados em formato aberto e reutilizavel",
         nav_portal="Menu: Dados Abertos",
         url_key="dados_abertos",
         obs_ausencia=""),

    dict(id="11.5", peso="recomendado", dimensao="Acessibilidade e Usabilidade",
         item="Perguntas frequentes / FAQ",
         cartilha_grupo="Grupo 11 — Acessibilidade",
         cartilha_criterio="Criterio 11.5 — Perguntas frequentes e glossario",
         nav_portal="Menu: Sobre o Portal > FAQ / Glossario",
         url_key="portal_inicio",
         obs_ausencia=""),
]


# ── Gera HTML ─────────────────────────────────────────────────────────────────

def gerar_html():
    def badge(peso):
        mapa = {
            "essencial":   ("#a93226", "#fdecea", "ESSENCIAL"),
            "obrigatorio": ("#b7770d", "#fef9e7", "OBRIGATORIO"),
            "recomendado": ("#1a5276", "#eaf2ff", "RECOMENDADO"),
        }
        cor, bg, txt = mapa.get(peso, ("#555", "#eee", peso.upper()))
        return (f'<span style="background:{bg};color:{cor};border:1px solid {cor};'
                f'padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700">{txt}</span>')

    total = len(CRITERIOS)
    enc   = sum(1 for c in CRITERIOS if res_map.get(c["id"],{}).get("encontrado"))
    score = round(enc/total*100, 1)

    def cor(p):
        return "#27ae60" if p>=75 else ("#e67e22" if p>=50 else "#e74c3c")

    # Resumo por dimensão
    dims: dict[str, list] = {}
    for c in CRITERIOS:
        dims.setdefault(c["dimensao"], []).append(c)

    resumo = ""
    for dim, lst in dims.items():
        e = sum(1 for x in lst if res_map.get(x["id"],{}).get("encontrado"))
        t = len(lst)
        p = round(e/t*100)
        c = cor(p)
        resumo += f"""
        <tr>
          <td style="padding:9px 14px;font-weight:600">{dim}</td>
          <td style="padding:9px 14px;text-align:center;color:#555">{t}</td>
          <td style="padding:9px 14px;text-align:center;color:#27ae60;font-weight:700">{e}</td>
          <td style="padding:9px 14px;text-align:center;color:#e74c3c;font-weight:700">{t-e}</td>
          <td style="padding:9px 14px;min-width:140px">
            <div style="background:#ecf0f1;border-radius:4px;height:12px;margin-bottom:2px">
              <div style="background:{c};width:{p}%;height:12px;border-radius:4px"></div>
            </div>
            <span style="font-size:11px;color:{c};font-weight:700">{p}%</span>
          </td>
        </tr>"""

    # Linhas de detalhe
    rows = ""
    prev_dim = ""
    for c in CRITERIOS:
        r         = res_map.get(c["id"], {})
        encontrado = r.get("encontrado", False)
        evidencia  = r.get("evidencia", "") or ""
        termo      = r.get("termo_localizado", "") or ""
        bg_row     = "#f0fff4" if encontrado else "#fff8f8"
        borda      = "#a9dfbf" if encontrado else "#f1948a"
        icon       = ('<span style="color:#27ae60;font-size:20px;font-weight:700">&#10003;</span>'
                      if encontrado else
                      '<span style="color:#e74c3c;font-size:20px;font-weight:700">&#10007;</span>')

        # Separador de dimensão
        sep = ""
        if c["dimensao"] != prev_dim:
            prev_dim = c["dimensao"]
            sep = (f'<tr><td colspan="7" style="background:#1a3c5e;color:#fff;'
                   f'padding:9px 16px;font-weight:700;font-size:13px;letter-spacing:.5px">'
                   f'{c["dimensao"]}</td></tr>')

        # URL do portal
        url_real = URLS_PORTAL.get(c["url_key"], PORTAL + "/#/")
        if encontrado:
            url_html = (f'<a href="{url_real}" target="_blank" '
                        f'style="color:#1a5276;font-size:11px;word-break:break-all;'
                        f'font-family:monospace">{url_real}</a>')
        else:
            url_html = f'<span style="color:#bbb;font-size:11px;font-style:italic">ausente no portal</span>'

        # Resposta do portal
        if encontrado:
            resp = (f'<div style="color:#1e8449;font-weight:600;font-size:12px">Disponivel</div>'
                    f'<div style="color:#555;font-size:11px;margin-top:2px">{evidencia}')
            if termo:
                resp += f' <code style="background:#eafaf1;padding:1px 4px;border-radius:3px">[{termo}]</code>'
            resp += "</div>"
        else:
            obs = c.get("obs_ausencia","") or "Item nao encontrado no portal."
            resp = (f'<div style="color:#c0392b;font-weight:600;font-size:12px">Ausente / Nao verificado</div>'
                    f'<div style="color:#888;font-size:11px;margin-top:2px">{obs}</div>')

        rows += f"""{sep}
        <tr style="background:{bg_row};border-left:4px solid {borda}">
          <td style="padding:11px 10px;text-align:center;vertical-align:top">{icon}</td>
          <td style="padding:11px 10px;font-weight:800;color:#1a3c5e;vertical-align:top;white-space:nowrap">{c['id']}</td>
          <td style="padding:11px 10px;font-weight:600;font-size:13px;vertical-align:top">{c['item']}</td>
          <td style="padding:11px 10px;text-align:center;vertical-align:top">{badge(c['peso'])}</td>
          <td style="padding:11px 10px;font-size:11px;vertical-align:top">
            <div style="font-weight:700;color:#1a3c5e;margin-bottom:3px">{c['cartilha_grupo']}</div>
            <div style="color:#666">{c['cartilha_criterio']}</div>
          </td>
          <td style="padding:11px 10px;font-size:11px;vertical-align:top">{resp}</td>
          <td style="padding:11px 10px;vertical-align:top">
            <div style="font-size:11px;color:#555;margin-bottom:4px">{c['nav_portal']}</div>
            {url_html}
          </td>
        </tr>"""

    # Itens essenciais faltando
    criticos = [c for c in CRITERIOS
                if not res_map.get(c["id"],{}).get("encontrado") and c["peso"]=="essencial"]
    alertas = "".join(
        f'<li style="margin-bottom:5px"><strong>[{c["id"]}]</strong> {c["item"]}'
        f' <span style="color:#888">({c["dimensao"]})</span></li>'
        for c in criticos)

    alerta_bloco = ""
    if criticos:
        alerta_bloco = f"""
        <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px 20px;
          border-radius:0 8px 8px 0;margin-bottom:22px">
          <strong style="color:#856404">Itens ESSENCIAIS ausentes ({len(criticos)}) —
          maior risco de penalizacao no PNTP 2026:</strong>
          <ul style="margin-top:10px;padding-left:20px">{alertas}</ul>
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PNTP 2026 x Transparencia Osasco — URLs</title>
  <style>
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{font-family:'Segoe UI',Arial,sans-serif;background:#eef1f5;color:#2c3e50}}
    header{{background:linear-gradient(135deg,#0a2340 0%,#1a6fbf 100%);color:#fff;
            padding:26px 36px;border-bottom:3px solid #f39c12}}
    header h1{{font-size:21px;margin-bottom:5px}}
    header p{{font-size:12px;opacity:.8;margin-top:3px}}
    header a{{color:#7ecbff}}
    .wrap{{max-width:1500px;margin:0 auto;padding:22px 14px}}
    .cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
            gap:12px;margin-bottom:22px}}
    .card{{background:#fff;border-radius:10px;padding:16px;text-align:center;
           box-shadow:0 1px 5px rgba(0,0,0,.08)}}
    .card .n{{font-size:34px;font-weight:800;line-height:1}}
    .card .l{{font-size:11px;color:#7f8c8d;margin-top:5px}}
    .box{{background:#fff;border-radius:10px;padding:20px 22px;margin-bottom:20px;
          box-shadow:0 1px 5px rgba(0,0,0,.07)}}
    .box h2{{font-size:15px;font-weight:700;color:#0a2340;margin-bottom:15px;
             padding-bottom:9px;border-bottom:2px solid #eee}}
    table{{width:100%;border-collapse:collapse}}
    thead th{{background:#0a2340;color:#fff;padding:10px 10px;font-size:11px;
              text-align:left;white-space:nowrap}}
    tbody tr:hover{{filter:brightness(.98)}}
    footer{{text-align:center;padding:18px;color:#aaa;font-size:11px;margin-top:10px}}
  </style>
</head>
<body>
<header>
  <h1>Analise PNTP 2026 x Portal da Transparencia de Osasco</h1>
  <p>Comparativo entre a <a href="{CARTILHA}" target="_blank">Cartilha PNTP 2026 (Atricon)</a>
     e as informacoes em <a href="{PORTAL}" target="_blank">{PORTAL}</a></p>
  <p>Gerado em: {datetime.now().strftime("%d/%m/%Y as %H:%M:%S")} &nbsp;|&nbsp;
     50 criterios avaliados</p>
</header>

<div class="wrap">

  <div class="cards">
    <div class="card">
      <div class="n" style="color:{cor(score)}">{score}%</div>
      <div class="l">Score PNTP 2026</div>
    </div>
    <div class="card">
      <div class="n" style="color:#2c3e50">{total}</div>
      <div class="l">Criterios avaliados</div>
    </div>
    <div class="card">
      <div class="n" style="color:#27ae60">{enc}</div>
      <div class="l">Encontrados</div>
    </div>
    <div class="card">
      <div class="n" style="color:#e74c3c">{total-enc}</div>
      <div class="l">Ausentes</div>
    </div>
    <div class="card">
      <div class="n" style="color:#e74c3c">{len(criticos)}</div>
      <div class="l">Essenciais em falta</div>
    </div>
  </div>

  {alerta_bloco}

  <div class="box">
    <h2>Resultado por Dimensao</h2>
    <table>
      <thead><tr>
        <th>Dimensao</th><th>Total</th><th>Encontrados</th><th>Ausentes</th><th>Score</th>
      </tr></thead>
      <tbody>{resumo}</tbody>
    </table>
  </div>

  <div class="box">
    <h2>Detalhamento Completo — ID | Item | Cartilha | Resposta no Portal | URL Completa</h2>
    <div style="overflow-x:auto">
    <table>
      <thead><tr>
        <th style="width:38px">OK</th>
        <th style="width:46px">ID</th>
        <th style="min-width:180px">Item PNTP 2026</th>
        <th style="width:110px">Tipo</th>
        <th style="min-width:200px">Secao na Cartilha PNTP 2026</th>
        <th style="min-width:200px">Resposta no Portal</th>
        <th style="min-width:260px">Caminho no Portal / URL</th>
      </tr></thead>
      <tbody>{rows}</tbody>
    </table>
    </div>
  </div>

  <div class="box">
    <h2>Legenda</h2>
    <p style="font-size:13px;line-height:1.8">
      {badge('essencial')} Ausencia penaliza severamente o score PNTP.<br>
      {badge('obrigatorio')} Exigido pela LAI — impacta nivel do selo (Ouro/Prata/Bronze).<br>
      {badge('recomendado')} Boa pratica — contribui positivamente sem ser eliminatorio.<br><br>
      <strong>Pesos PNTP 2026:</strong> Atualidade 40% &bull; Integralidade 40% &bull;
      Serie Historica 20%<br>
      <strong>Selo Ouro:</strong> >=90% &bull; <strong>Prata:</strong> 70-89% &bull;
      <strong>Bronze:</strong> 50-69% &bull; <strong>Sem selo:</strong> &lt;50%<br><br>
      <strong>Portal avaliado:</strong> <a href="{PORTAL}" target="_blank">{PORTAL}</a><br>
      <strong>Cartilha:</strong> <a href="{CARTILHA}" target="_blank">Cartilha-PNTP-2026.pdf (Atricon)</a>
    </p>
  </div>

</div>
<footer>
  Gerado por Claude Code &nbsp;|&nbsp; {datetime.now().strftime("%d/%m/%Y")} &nbsp;|&nbsp;
  {PORTAL}
</footer>
</body>
</html>"""

    arq = "relatorio_pntp_urls.html"
    Path(arq).write_text(html, encoding="utf-8")
    print(f"Relatorio gerado: {arq}")
    print(f"Score: {score}% ({enc}/{total})")
    print(f"Essenciais em falta: {len(criticos)}")
    return arq


if __name__ == "__main__":
    arq = gerar_html()
    import subprocess, os
    os.startfile(arq)
