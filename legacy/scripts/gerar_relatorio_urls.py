#!/usr/bin/env python3
"""
Relatório PNTP 2026 x Portal Transparência Osasco — com URLs completas
Navega cada seção do portal clicando nos menus e captura a URL real (SPA routing).
"""

import asyncio
import io
import json
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

PORTAL_URL = "https://transparencia-osasco.smarapd.com.br"

# ── Mapeamento PNTP 2026 → menus do portal SMARAPD ───────────────────────────
# Cada item associa: id PNTP, cartilha (seção/página), menu do portal, sub-menu, termos de busca
MAPA_PNTP = [
    # ─── GRUPO 1 — INFORMAÇÕES INSTITUCIONAIS ────────────────────────────────
    {
        "id": "1.1", "peso": "essencial",
        "dimensao": "Informações Institucionais",
        "item": "Estrutura organizacional / Organograma",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.1 — Organograma da entidade",
        "menu_portal": "Administração Pública",
        "submenu_portal": "Organograma / Estrutura Organizacional",
        "termos": ["organograma", "estrutura organizacional"],
    },
    {
        "id": "1.2", "peso": "essencial",
        "dimensao": "Informações Institucionais",
        "item": "Competências e atribuições do órgão",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.2 — Competências e estrutura organizacional",
        "menu_portal": "Administração Pública",
        "submenu_portal": "Competências / Atribuições",
        "termos": ["competências", "atribuições"],
    },
    {
        "id": "1.3", "peso": "essencial",
        "dimensao": "Informações Institucionais",
        "item": "Endereço e horários de atendimento",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.3 — Endereço e horários de funcionamento",
        "menu_portal": "Sobre o Portal / Página inicial",
        "submenu_portal": "—",
        "termos": ["endereço", "horário"],
    },
    {
        "id": "1.4", "peso": "obrigatório",
        "dimensao": "Informações Institucionais",
        "item": "Legislação aplicável",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.4 — Normas e legislação",
        "menu_portal": "Legislação e Imprensa Oficial do Município",
        "submenu_portal": "Legislação sobre Transparência",
        "termos": ["legislação", "lei municipal", "decreto"],
    },
    {
        "id": "1.5", "peso": "recomendado",
        "dimensao": "Informações Institucionais",
        "item": "Agenda do gestor",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.5 — Agenda da autoridade máxima",
        "menu_portal": "Administração Pública",
        "submenu_portal": "Agenda do Prefeito / Gestor",
        "termos": ["agenda", "agenda do prefeito"],
    },
    {
        "id": "1.6", "peso": "obrigatório",
        "dimensao": "Informações Institucionais",
        "item": "Link para o Radar da Transparência (PNTP)",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.6 — Link para o Radar da Transparência Pública",
        "menu_portal": "Sobre o Portal",
        "submenu_portal": "Avaliações Sobre Transparência Municipal",
        "termos": ["radar", "pntp", "atricon"],
    },
    {
        "id": "1.7", "peso": "essencial",
        "dimensao": "Informações Institucionais",
        "item": "Plano Plurianual (PPA)",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.7 — Instrumentos de planejamento: PPA",
        "menu_portal": "Peças Orçamentárias",
        "submenu_portal": "Plano Plurianual (PPA)",
        "termos": ["ppa", "plano plurianual"],
    },
    {
        "id": "1.8", "peso": "essencial",
        "dimensao": "Informações Institucionais",
        "item": "Lei de Diretrizes Orçamentárias (LDO)",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.8 — Instrumentos de planejamento: LDO",
        "menu_portal": "Peças Orçamentárias",
        "submenu_portal": "Lei de Diretrizes Orçamentárias (LDO)",
        "termos": ["ldo", "lei de diretrizes"],
    },
    {
        "id": "1.9", "peso": "essencial",
        "dimensao": "Informações Institucionais",
        "item": "Lei Orçamentária Anual (LOA)",
        "cartilha_grupo": "Grupo 1 — Informações Institucionais",
        "cartilha_criterio": "Critério 1.9 — Instrumentos de planejamento: LOA",
        "menu_portal": "Peças Orçamentárias",
        "submenu_portal": "Lei Orçamentária Anual (LOA)",
        "termos": ["loa", "lei orçamentária"],
    },

    # ─── GRUPO 2 — RECEITAS ───────────────────────────────────────────────────
    {
        "id": "2.1", "peso": "essencial",
        "dimensao": "Receitas",
        "item": "Previsão e arrecadação de receitas",
        "cartilha_grupo": "Grupo 2 — Receitas",
        "cartilha_criterio": "Critério 2.1 — Receitas previstas e arrecadadas",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Receitas → Receita Analítica / Receita Arrecadada por Rubrica",
        "termos": ["receita", "arrecadação"],
    },
    {
        "id": "2.2", "peso": "essencial",
        "dimensao": "Receitas",
        "item": "Receitas por categoria econômica",
        "cartilha_grupo": "Grupo 2 — Receitas",
        "cartilha_criterio": "Critério 2.2 — Classificação por categoria econômica",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Receitas → Receita Corrente / Receita Capital",
        "termos": ["receita corrente", "receita capital"],
    },
    {
        "id": "2.3", "peso": "essencial",
        "dimensao": "Receitas",
        "item": "Série histórica de receitas (mínimo 3 anos)",
        "cartilha_grupo": "Grupo 2 — Receitas",
        "cartilha_criterio": "Critério 2.3 — Série histórica de receitas (≥3 anos)",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Receitas — filtro por exercício anterior",
        "termos": ["histórico receita", "exercício anterior"],
    },
    {
        "id": "2.4", "peso": "obrigatório",
        "dimensao": "Receitas",
        "item": "Transferências recebidas (FPM, FUNDEB etc.)",
        "cartilha_grupo": "Grupo 2 — Receitas",
        "cartilha_criterio": "Critério 2.4 — Transferências intergovernamentais",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Receitas → Receita Arrecadada Transferências Constitucionais",
        "termos": ["transferências", "fpm", "fundeb"],
    },
    {
        "id": "2.5", "peso": "obrigatório",
        "dimensao": "Receitas",
        "item": "Receita por fonte de recursos",
        "cartilha_grupo": "Grupo 2 — Receitas",
        "cartilha_criterio": "Critério 2.5 — Receitas por fonte de recursos",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Receitas → Receita Prevista por Rubrica",
        "termos": ["fonte de recurso"],
    },

    # ─── GRUPO 3 — DESPESAS ───────────────────────────────────────────────────
    {
        "id": "3.1", "peso": "essencial",
        "dimensao": "Despesas",
        "item": "Despesas por categoria / elemento / função",
        "cartilha_grupo": "Grupo 3 — Despesas",
        "cartilha_criterio": "Critério 3.1 — Despesas por classificação",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Despesas → Despesas Filtradas / Despesas Sintéticas",
        "termos": ["despesa", "elemento de despesa"],
    },
    {
        "id": "3.2", "peso": "essencial",
        "dimensao": "Despesas",
        "item": "Empenhos, liquidações e pagamentos",
        "cartilha_grupo": "Grupo 3 — Despesas",
        "cartilha_criterio": "Critério 3.2 — Estágios da despesa (empenho/liquidação/pagamento)",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Empenhos / Financeiro",
        "termos": ["empenho", "liquidação", "pagamento"],
    },
    {
        "id": "3.3", "peso": "essencial",
        "dimensao": "Despesas",
        "item": "Série histórica de despesas (mínimo 3 anos)",
        "cartilha_grupo": "Grupo 3 — Despesas",
        "cartilha_criterio": "Critério 3.3 — Série histórica de despesas (≥3 anos)",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Despesas — filtro por exercício anterior",
        "termos": ["histórico despesa"],
    },
    {
        "id": "3.4", "peso": "essencial",
        "dimensao": "Despesas",
        "item": "Diárias e passagens",
        "cartilha_grupo": "Grupo 3 — Despesas",
        "cartilha_criterio": "Critério 3.4 — Gastos com diárias e passagens",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Despesas → Despesas com Viagens",
        "termos": ["diária", "viagem", "passagem"],
    },
    {
        "id": "3.5", "peso": "obrigatório",
        "dimensao": "Despesas",
        "item": "Despesas com cartão corporativo",
        "cartilha_grupo": "Grupo 3 — Despesas",
        "cartilha_criterio": "Critério 3.5 — Gastos com cartão corporativo",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Despesas → Cartão Corporativo (não encontrado)",
        "termos": ["cartão corporativo"],
    },
    {
        "id": "3.6", "peso": "essencial",
        "dimensao": "Despesas",
        "item": "Execução orçamentária e financeira",
        "cartilha_grupo": "Grupo 3 — Despesas",
        "cartilha_criterio": "Critério 3.6 — Execução orçamentária consolidada",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Peças Contábeis / Relatórios LRF",
        "termos": ["execução orçamentária", "execução financeira"],
    },

    # ─── GRUPO 4 — LICITAÇÕES E CONTRATOS ────────────────────────────────────
    {
        "id": "4.1", "peso": "essencial",
        "dimensao": "Licitações e Contratos",
        "item": "Editais de licitação",
        "cartilha_grupo": "Grupo 4 — Licitações e Contratos",
        "cartilha_criterio": "Critério 4.1 — Editais de licitação publicados",
        "menu_portal": "Licitações e Contratos",
        "submenu_portal": "Editais / Avisos de Licitação",
        "termos": ["edital", "licitação", "pregão"],
    },
    {
        "id": "4.2", "peso": "essencial",
        "dimensao": "Licitações e Contratos",
        "item": "Resultado de licitações",
        "cartilha_grupo": "Grupo 4 — Licitações e Contratos",
        "cartilha_criterio": "Critério 4.2 — Resultados e homologações",
        "menu_portal": "Licitações e Contratos",
        "submenu_portal": "Resultados / Homologações",
        "termos": ["resultado licitação", "homologação"],
    },
    {
        "id": "4.3", "peso": "essencial",
        "dimensao": "Licitações e Contratos",
        "item": "Contratos e aditivos",
        "cartilha_grupo": "Grupo 4 — Licitações e Contratos",
        "cartilha_criterio": "Critério 4.3 — Contratos firmados e termos aditivos",
        "menu_portal": "Licitações e Contratos",
        "submenu_portal": "Contratos / Termos Aditivos",
        "termos": ["contrato", "aditivo"],
    },
    {
        "id": "4.4", "peso": "essencial",
        "dimensao": "Licitações e Contratos",
        "item": "Dispensas e inexigibilidades",
        "cartilha_grupo": "Grupo 4 — Licitações e Contratos",
        "cartilha_criterio": "Critério 4.4 — Contratações diretas (dispensa/inexigibilidade)",
        "menu_portal": "Licitações e Contratos",
        "submenu_portal": "Dispensas / Inexigibilidades",
        "termos": ["dispensa", "inexigibilidade"],
    },
    {
        "id": "4.5", "peso": "obrigatório",
        "dimensao": "Licitações e Contratos",
        "item": "Plano de Contratações Anual (PCA)",
        "cartilha_grupo": "Grupo 4 — Licitações e Contratos",
        "cartilha_criterio": "Critério 4.5 — Plano de Contratações Anual",
        "menu_portal": "Licitações e Contratos",
        "submenu_portal": "Plano de Contratações Anual (PCA)",
        "termos": ["plano de contratações", "pca"],
    },
    {
        "id": "4.6", "peso": "obrigatório",
        "dimensao": "Licitações e Contratos",
        "item": "Atas de registro de preços",
        "cartilha_grupo": "Grupo 4 — Licitações e Contratos",
        "cartilha_criterio": "Critério 4.6 — Atas de registro de preços",
        "menu_portal": "Licitações e Contratos",
        "submenu_portal": "Atas de Registro de Preços",
        "termos": ["ata de registro", "registro de preços"],
    },

    # ─── GRUPO 5 — RECURSOS HUMANOS ───────────────────────────────────────────
    {
        "id": "5.1", "peso": "essencial",
        "dimensao": "Recursos Humanos",
        "item": "Remuneração nominal dos servidores",
        "cartilha_grupo": "Grupo 5 — Recursos Humanos",
        "cartilha_criterio": "Critério 5.1 — Remuneração nominal individualizada",
        "menu_portal": "Gestão de Pessoas",
        "submenu_portal": "Remuneração / Servidores",
        "termos": ["remuneração", "servidor"],
    },
    {
        "id": "5.2", "peso": "essencial",
        "dimensao": "Recursos Humanos",
        "item": "Quadro de servidores efetivos e comissionados",
        "cartilha_grupo": "Grupo 5 — Recursos Humanos",
        "cartilha_criterio": "Critério 5.2 — Quadro de pessoal por vínculo",
        "menu_portal": "Gestão de Pessoas",
        "submenu_portal": "Quadro de Servidores / Efetivos / Comissionados",
        "termos": ["quadro de servidores", "efetivo", "comissionado"],
    },
    {
        "id": "5.3", "peso": "obrigatório",
        "dimensao": "Recursos Humanos",
        "item": "Concursos públicos e processos seletivos",
        "cartilha_grupo": "Grupo 5 — Recursos Humanos",
        "cartilha_criterio": "Critério 5.3 — Concursos e processos seletivos",
        "menu_portal": "Concursos e Processos Seletivos",
        "submenu_portal": "Concursos Abertos / Relação de Concursos",
        "termos": ["concurso", "processo seletivo"],
    },
    {
        "id": "5.4", "peso": "recomendado",
        "dimensao": "Recursos Humanos",
        "item": "Estagiários",
        "cartilha_grupo": "Grupo 5 — Recursos Humanos",
        "cartilha_criterio": "Critério 5.4 — Relação de estagiários",
        "menu_portal": "Gestão de Pessoas",
        "submenu_portal": "Estagiários (não identificado no menu)",
        "termos": ["estagiário", "estágio"],
    },
    {
        "id": "5.5", "peso": "obrigatório",
        "dimensao": "Recursos Humanos",
        "item": "Terceirizados / Contratos de mão de obra",
        "cartilha_grupo": "Grupo 5 — Recursos Humanos",
        "cartilha_criterio": "Critério 5.5 — Trabalhadores terceirizados",
        "menu_portal": "Gestão de Pessoas / Licitações e Contratos",
        "submenu_portal": "Terceirizados (não identificado no menu)",
        "termos": ["terceirizado", "terceirização"],
    },

    # ─── GRUPO 6 — CONVÊNIOS E REPASSES ──────────────────────────────────────
    {
        "id": "6.1", "peso": "essencial",
        "dimensao": "Convênios e Repasses",
        "item": "Convênios celebrados",
        "cartilha_grupo": "Grupo 6 — Convênios e Repasses",
        "cartilha_criterio": "Critério 6.1 — Convênios firmados",
        "menu_portal": "Terceiro Setor / Convênios",
        "submenu_portal": "Convênios / Convênios de Cooperação",
        "termos": ["convênio"],
    },
    {
        "id": "6.2", "peso": "essencial",
        "dimensao": "Convênios e Repasses",
        "item": "Repasses a entidades privadas / OSC",
        "cartilha_grupo": "Grupo 6 — Convênios e Repasses",
        "cartilha_criterio": "Critério 6.2 — Repasses e subvenções a OSC",
        "menu_portal": "Contas Públicas / Terceiro Setor",
        "submenu_portal": "Repasses e Transferências / Repasses Mundo da Criança",
        "termos": ["repasse", "osc", "terceiro setor"],
    },
    {
        "id": "6.3", "peso": "obrigatório",
        "dimensao": "Convênios e Repasses",
        "item": "Prestação de contas de convênios",
        "cartilha_grupo": "Grupo 6 — Convênios e Repasses",
        "cartilha_criterio": "Critério 6.3 — Prestação de contas dos convênios",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Prestação de Contas",
        "termos": ["prestação de contas"],
    },
    {
        "id": "6.4", "peso": "obrigatório",
        "dimensao": "Convênios e Repasses",
        "item": "Emendas parlamentares",
        "cartilha_grupo": "Grupo 6 — Convênios e Repasses",
        "cartilha_criterio": "Critério 6.4 — Emendas parlamentares recebidas",
        "menu_portal": "Emendas Parlamentares",
        "submenu_portal": "Emendas Estadual e Federal / Emendas Recebidas",
        "termos": ["emenda parlamentar", "emenda"],
    },

    # ─── GRUPO 7 — OBRAS ──────────────────────────────────────────────────────
    {
        "id": "7.1", "peso": "essencial",
        "dimensao": "Obras",
        "item": "Obras em execução",
        "cartilha_grupo": "Grupo 7 — Obras Públicas",
        "cartilha_criterio": "Critério 7.1 — Obras em andamento",
        "menu_portal": "Projetos e Obras",
        "submenu_portal": "Projetos e Obras",
        "termos": ["obra", "obras"],
    },
    {
        "id": "7.2", "peso": "essencial",
        "dimensao": "Obras",
        "item": "Contratos de obras com localização",
        "cartilha_grupo": "Grupo 7 — Obras Públicas",
        "cartilha_criterio": "Critério 7.2 — Localização e andamento das obras",
        "menu_portal": "Projetos e Obras",
        "submenu_portal": "Mapa de Obras / Geolocalização (não identificado)",
        "termos": ["localização obra", "mapa obra"],
    },

    # ─── GRUPO 8 — SAÚDE ──────────────────────────────────────────────────────
    {
        "id": "8.1", "peso": "essencial",
        "dimensao": "Saúde",
        "item": "Gastos com saúde",
        "cartilha_grupo": "Grupo 8 — Saúde",
        "cartilha_criterio": "Critério 8.1 — Despesas com saúde",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Despesas → Despesa por Função: Saúde",
        "termos": ["saúde", "gasto saúde"],
    },
    {
        "id": "8.2", "peso": "obrigatório",
        "dimensao": "Saúde",
        "item": "Repasses fundo a fundo saúde",
        "cartilha_grupo": "Grupo 8 — Saúde",
        "cartilha_criterio": "Critério 8.2 — Transferências fundo a fundo (saúde)",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Receitas → Receitas Arrecadadas de Fundos Municipais",
        "termos": ["fundo de saúde", "fundo municipal de saúde"],
    },

    # ─── GRUPO 9 — EDUCAÇÃO ───────────────────────────────────────────────────
    {
        "id": "9.1", "peso": "essencial",
        "dimensao": "Educação",
        "item": "Gastos com educação / FUNDEB",
        "cartilha_grupo": "Grupo 9 — Educação",
        "cartilha_criterio": "Critério 9.1 — Despesas com educação e FUNDEB",
        "menu_portal": "Contas Públicas",
        "submenu_portal": "Despesas → Despesa por Função: Educação / FUNDEB",
        "termos": ["educação", "fundeb"],
    },
    {
        "id": "9.2", "peso": "obrigatório",
        "dimensao": "Educação",
        "item": "Merenda escolar / alimentação",
        "cartilha_grupo": "Grupo 9 — Educação",
        "cartilha_criterio": "Critério 9.2 — Programa Nacional de Alimentação Escolar (PNAE)",
        "menu_portal": "Contas Públicas / Políticas Municipais",
        "submenu_portal": "Merenda / Alimentação Escolar (não identificado)",
        "termos": ["merenda", "alimentação escolar", "pnae"],
    },

    # ─── GRUPO 10 — OUVIDORIA E LAI ───────────────────────────────────────────
    {
        "id": "10.1", "peso": "essencial",
        "dimensao": "Ouvidoria e LAI",
        "item": "Canal de atendimento LAI / e-SIC online",
        "cartilha_grupo": "Grupo 10 — Transparência Passiva (LAI)",
        "cartilha_criterio": "Critério 10.1 — Serviço de Informação ao Cidadão (e-SIC)",
        "menu_portal": "Ouvidoria Geral / Fala Cidadão",
        "submenu_portal": "Fala Cidadão / e-SIC",
        "termos": ["e-sic", "sic", "lai", "pedido de informação"],
    },
    {
        "id": "10.2", "peso": "essencial",
        "dimensao": "Ouvidoria e LAI",
        "item": "Ouvidoria municipal",
        "cartilha_grupo": "Grupo 10 — Transparência Passiva (LAI)",
        "cartilha_criterio": "Critério 10.2 — Canal de ouvidoria",
        "menu_portal": "Ouvidoria Geral / Canais de participação",
        "submenu_portal": "Ouvidoria Geral / Central de Atendimento 156",
        "termos": ["ouvidoria", "manifestação"],
    },
    {
        "id": "10.3", "peso": "obrigatório",
        "dimensao": "Ouvidoria e LAI",
        "item": "Estatísticas de pedidos de informação",
        "cartilha_grupo": "Grupo 10 — Transparência Passiva (LAI)",
        "cartilha_criterio": "Critério 10.3 — Relatório estatístico LAI",
        "menu_portal": "Sobre o Portal",
        "submenu_portal": "Estatísticas de pedidos LAI (não identificado)",
        "termos": ["estatística lai", "relatório lai"],
    },
    {
        "id": "10.4", "peso": "obrigatório",
        "dimensao": "Ouvidoria e LAI",
        "item": "Rol de informações sigilosas",
        "cartilha_grupo": "Grupo 10 — Transparência Passiva (LAI)",
        "cartilha_criterio": "Critério 10.4 — Rol de informações classificadas",
        "menu_portal": "Sobre o Portal / Legislação",
        "submenu_portal": "Rol de Informações Sigilosas (não identificado)",
        "termos": ["sigiloso", "rol de informações"],
    },

    # ─── GRUPO 11 — ACESSIBILIDADE E USABILIDADE ─────────────────────────────
    {
        "id": "11.1", "peso": "essencial",
        "dimensao": "Acessibilidade e Usabilidade",
        "item": "Barra de acessibilidade (contraste, fonte, VLibras)",
        "cartilha_grupo": "Grupo 11 — Acessibilidade",
        "cartilha_criterio": "Critério 11.1 — Recursos de acessibilidade digital",
        "menu_portal": "Barra superior do portal",
        "submenu_portal": "AA+ A- (barra de acessibilidade visível)",
        "termos": ["acessibilidade", "alto contraste", "vlibras"],
    },
    {
        "id": "11.2", "peso": "essencial",
        "dimensao": "Acessibilidade e Usabilidade",
        "item": "Campo de busca / pesquisa no portal",
        "cartilha_grupo": "Grupo 11 — Acessibilidade",
        "cartilha_criterio": "Critério 11.2 — Ferramenta de busca funcional",
        "menu_portal": "Topo esquerdo do portal",
        "submenu_portal": "input[type=search] — campo existe mas indexação limitada",
        "termos": ["busca", "pesquisa"],
    },
    {
        "id": "11.3", "peso": "obrigatório",
        "dimensao": "Acessibilidade e Usabilidade",
        "item": "Mapa do site",
        "cartilha_grupo": "Grupo 11 — Acessibilidade",
        "cartilha_criterio": "Critério 11.3 — Mapa do site (sitemap)",
        "menu_portal": "Sobre o Portal",
        "submenu_portal": "Sumário / Mapa do Site",
        "termos": ["mapa do site", "sitemap", "sumário"],
    },
    {
        "id": "11.4", "peso": "obrigatório",
        "dimensao": "Acessibilidade e Usabilidade",
        "item": "Dados em formato aberto (CSV / JSON / XML)",
        "cartilha_grupo": "Grupo 11 — Acessibilidade",
        "cartilha_criterio": "Critério 11.4 — Dados em formato aberto e reutilizável",
        "menu_portal": "Dados Abertos",
        "submenu_portal": "Dados Abertos (menu principal)",
        "termos": ["dados abertos", "csv", "json"],
    },
    {
        "id": "11.5", "peso": "recomendado",
        "dimensao": "Acessibilidade e Usabilidade",
        "item": "Perguntas frequentes / FAQ",
        "cartilha_grupo": "Grupo 11 — Acessibilidade",
        "cartilha_criterio": "Critério 11.5 — Perguntas frequentes",
        "menu_portal": "Sobre o Portal",
        "submenu_portal": "FAQ / Glossário",
        "termos": ["faq", "perguntas frequentes"],
    },
]


# ── Navega o portal e captura URLs reais clicando nos menus ──────────────────

async def capturar_urls_portal() -> dict[str, str]:
    """Retorna um mapa {texto_menu: url_real} navegando o portal com Playwright."""
    try:
        from playwright.async_api import async_playwright, TimeoutError as PWTimeout
    except ImportError:
        return {}

    url_map: dict[str, str] = {}

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1366, "height": 768},
            locale="pt-BR",
        )
        page = await context.new_page()

        print("Carregando portal...")
        await page.goto(PORTAL_URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(2000)

        # Pega todos os textos de link visíveis na página
        todos_links = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('a, [role=menuitem], button'))
                .map(el => ({
                    text: el.innerText?.trim().replace(/\\s+/g, ' ') || '',
                    tag: el.tagName
                }))
                .filter(l => l.text.length > 3 && l.text.length < 80);
        }""")

        # Menus que queremos mapear (baseado na estrutura descoberta)
        menus_alvo = [
            "Administração Pública", "Licitações e Contratos", "Gestão de Pessoas",
            "Peças Orçamentárias", "Peças Contábeis", "Contas Públicas",
            "Projetos e Obras", "Terceiro Setor", "Convênios",
            "Emendas Parlamentares", "Ouvidoria Geral", "Fala Cidadão",
            "Dados Abertos", "Legislação e Imprensa Oficial do Município",
            "Concursos e Processos Seletivos", "Sobre o Portal",
            "Políticas, Planos Municipais, Ind. e Inf. Temática",
            "Receitas", "Despesas", "Empenhos", "Financeiro",
            "Repasses e Transferências", "Prestação de Contas",
            "Relatórios LRF - Lei de Responsabilidade Fiscal",
        ]

        for menu_texto in menus_alvo:
            try:
                await page.goto(PORTAL_URL, wait_until="networkidle", timeout=20000)
                await page.wait_for_timeout(800)

                # Tenta encontrar e clicar no item de menu
                el = page.get_by_text(menu_texto, exact=True).first
                count = await el.count()
                if count == 0:
                    # Tenta match parcial
                    el = page.locator(f"text={menu_texto[:20]}").first
                    count = await el.count()

                if count > 0:
                    await el.click(timeout=5000)
                    await page.wait_for_timeout(1500)
                    url_atual = page.url
                    url_map[menu_texto] = url_atual
                    print(f"  ✓ {menu_texto[:40]:<40} → {url_atual}")
                else:
                    url_map[menu_texto] = f"{PORTAL_URL}  [menu não clicável]"
                    print(f"  - {menu_texto[:40]:<40} → [não encontrado]")

            except PWTimeout:
                url_map[menu_texto] = f"{PORTAL_URL}  [timeout]"
            except Exception as e:
                url_map[menu_texto] = f"{PORTAL_URL}  [erro: {str(e)[:40]}]"

        await browser.close()

    return url_map


# ── Carrega resultado anterior da análise ────────────────────────────────────

def carregar_resultados_anteriores() -> dict[str, dict]:
    """Lê o relatorio_pntp.json gerado na análise anterior."""
    caminho = Path("relatorio_pntp.json")
    if not caminho.exists():
        return {}
    dados = json.loads(caminho.read_text(encoding="utf-8"))
    return {r["id"]: r for r in dados.get("resultados", [])}


# ── Gera HTML do relatório detalhado ─────────────────────────────────────────

def gerar_html(itens: list[dict], url_map: dict[str, str], arquivo: str = "relatorio_pntp_urls.html"):

    def badge(peso):
        cores = {
            "essencial":   ("#c0392b", "#fdecea"),
            "obrigatório": ("#d35400", "#fef3ea"),
            "recomendado": ("#1a6fbf", "#eaf3fc"),
        }
        bg, lbl_bg = cores.get(peso, ("#555", "#eee"))
        return (f'<span style="background:{lbl_bg};color:{bg};border:1px solid {bg};'
                f'padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;'
                f'white-space:nowrap">{peso.upper()}</span>')

    def status_icon(encontrado):
        if encontrado:
            return '<span style="color:#27ae60;font-size:18px" title="Encontrado">&#10003;</span>'
        return '<span style="color:#e74c3c;font-size:18px" title="Ausente">&#10007;</span>'

    def url_link(url, texto=None):
        if not url or url.startswith(PORTAL_URL + "  "):
            return '<span style="color:#bbb;font-size:12px">— não mapeado —</span>'
        label = texto or url
        return (f'<a href="{url}" target="_blank" '
                f'style="color:#1a6fbf;font-size:12px;word-break:break-all">{label}</a>')

    total = len(itens)
    enc = sum(1 for i in itens if i.get("encontrado"))
    score = round(enc / total * 100, 1)

    def cor_score(p):
        if p >= 75: return "#27ae60"
        if p >= 50: return "#f39c12"
        return "#e74c3c"

    # ── Resumo por dimensão ──
    dims: dict[str, list] = {}
    for it in itens:
        dims.setdefault(it["dimensao"], []).append(it)

    resumo_rows = ""
    for dim, lista in dims.items():
        e = sum(1 for x in lista if x.get("encontrado"))
        t = len(lista)
        pct = round(e / t * 100)
        c = cor_score(pct)
        resumo_rows += f"""
        <tr>
          <td style="padding:8px 14px;font-weight:600">{dim}</td>
          <td style="padding:8px 14px;text-align:center">{t}</td>
          <td style="padding:8px 14px;text-align:center;color:#27ae60;font-weight:700">{e}</td>
          <td style="padding:8px 14px;text-align:center;color:#e74c3c;font-weight:700">{t-e}</td>
          <td style="padding:8px 14px;min-width:120px">
            <div style="background:#ecf0f1;border-radius:4px;height:14px">
              <div style="background:{c};width:{pct}%;height:14px;border-radius:4px"></div>
            </div>
            <span style="font-size:12px;color:{c};font-weight:700">{pct}%</span>
          </td>
        </tr>"""

    # ── Linhas de detalhe ──
    detalhe_rows = ""
    prev_dim = ""
    for it in itens:
        encontrado = it.get("encontrado", False)
        bg = "#f0fff4" if encontrado else "#fff8f8"
        borda = "#c3e6cb" if encontrado else "#f5c6cb"

        # Separador de dimensão
        sep = ""
        if it["dimensao"] != prev_dim:
            prev_dim = it["dimensao"]
            sep = f"""<tr><td colspan="7" style="background:#1a3c5e;color:#fff;
                padding:8px 14px;font-weight:700;font-size:13px;letter-spacing:0.5px">
                {it['dimensao']}</td></tr>"""

        # URL do portal — usa url_map para o menu correspondente, ou url_encontrada
        url_portal = it.get("url_encontrada", "") or ""
        # Tenta enriquecer com URL do menu mapeado
        menu_principal = it.get("menu_portal", "")
        for chave, url_nav in url_map.items():
            if chave and chave in menu_principal and not url_nav.endswith("[não encontrado]"):
                if url_nav and not url_nav.endswith("[menu não clicável]"):
                    url_portal = url_nav
                    break

        # Cria link clicável
        if url_portal and url_portal.startswith("http") and "  [" not in url_portal:
            url_html = f'<a href="{url_portal}" target="_blank" style="color:#1a6fbf;font-size:11px;word-break:break-all">{url_portal}</a>'
        elif it.get("encontrado"):
            url_html = f'<span style="color:#888;font-size:11px">{PORTAL_URL}</span>'
        else:
            url_html = '<span style="color:#ccc;font-size:11px">— ausente no portal —</span>'

        submenu = it.get("submenu_portal", "—")
        evidencia = it.get("evidencia", "") or "—"
        termo = it.get("termo_localizado", "")
        if termo:
            evidencia = f'{evidencia} <code style="background:#f8f9fa;padding:1px 4px;border-radius:3px;font-size:11px">[{termo}]</code>'

        detalhe_rows += f"""{sep}
        <tr style="background:{bg};border-left:3px solid {borda}">
          <td style="padding:10px 12px;text-align:center">{status_icon(encontrado)}</td>
          <td style="padding:10px 12px;font-weight:700;color:#1a3c5e;white-space:nowrap">{it['id']}</td>
          <td style="padding:10px 12px;font-size:13px">{it['item']}</td>
          <td style="padding:10px 12px;text-align:center">{badge(it['peso'])}</td>
          <td style="padding:10px 12px;font-size:12px;color:#555">
            <div style="font-weight:600;color:#1a3c5e;margin-bottom:2px">{it['cartilha_grupo']}</div>
            <div style="color:#666">{it['cartilha_criterio']}</div>
          </td>
          <td style="padding:10px 12px;font-size:12px;color:#555">
            <div style="font-weight:600;margin-bottom:2px">{it['menu_portal']}</div>
            <div style="color:#777;font-style:italic">{submenu}</div>
          </td>
          <td style="padding:10px 12px">{url_html}</td>
        </tr>"""

    criticos = [it for it in itens if not it.get("encontrado") and it["peso"] == "essencial"]
    criticos_html = "".join(
        f'<li style="margin-bottom:6px"><strong>[{r["id"]}]</strong> {r["item"]}'
        f' <span style="color:#888;font-size:12px">({r["dimensao"]})</span></li>'
        for r in criticos
    )

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PNTP 2026 x Portal Transparência Osasco — Relatório de URLs</title>
  <style>
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;color:#2c3e50;font-size:14px}}
    header{{background:linear-gradient(135deg,#0d2b4e 0%,#1a6fbf 100%);color:#fff;padding:28px 36px}}
    header h1{{font-size:22px;margin-bottom:6px}}
    header p{{opacity:.8;font-size:13px;margin-top:4px}}
    .wrap{{max-width:1400px;margin:0 auto;padding:24px 16px}}
    .cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px}}
    .card{{background:#fff;border-radius:10px;padding:18px;text-align:center;box-shadow:0 1px 6px rgba(0,0,0,.08)}}
    .card .n{{font-size:36px;font-weight:800;line-height:1.1}}
    .card .l{{font-size:12px;color:#7f8c8d;margin-top:4px}}
    .box{{background:#fff;border-radius:10px;padding:20px 24px;margin-bottom:20px;box-shadow:0 1px 6px rgba(0,0,0,.07)}}
    .box h2{{font-size:16px;font-weight:700;color:#0d2b4e;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #eee}}
    table{{width:100%;border-collapse:collapse}}
    thead th{{background:#0d2b4e;color:#fff;padding:10px 12px;font-size:12px;text-align:left;white-space:nowrap}}
    tbody tr:hover{{filter:brightness(.97)}}
    .alert{{background:#fff8e1;border-left:4px solid #ffc107;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:20px}}
    .alert h3{{color:#856404;margin-bottom:10px;font-size:14px}}
    .alert ul{{padding-left:20px}}
    footer{{text-align:center;padding:20px;color:#aaa;font-size:11px;margin-top:16px}}
    @media(max-width:900px){{thead th:nth-child(5),tbody td:nth-child(5){{display:none}}}}
  </style>
</head>
<body>
<header>
  <h1>Analise PNTP 2026 x Portal da Transparencia de Osasco</h1>
  <p>Comparativo entre os criterios da Cartilha PNTP 2026 (Atricon) e as informacoes disponiveis em
     <a href="{PORTAL_URL}" target="_blank" style="color:#7ecbff">{PORTAL_URL}</a></p>
  <p>Gerado em: {datetime.now().strftime("%d/%m/%Y as %H:%M:%S")} &nbsp;|&nbsp;
     Cartilha: <a href="https://radardatransparencia.atricon.org.br/pdf/Cartilha-PNTP-2026.pdf"
     target="_blank" style="color:#7ecbff">Cartilha-PNTP-2026.pdf</a></p>
</header>

<div class="wrap">

  <!-- KPIs -->
  <div class="cards">
    <div class="card">
      <div class="n" style="color:{cor_score(score)}">{score}%</div>
      <div class="l">Score Geral PNTP</div>
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

  <!-- Alertas criticos -->
  {"" if not criticos else f'''
  <div class="alert">
    <h3>Itens ESSENCIAIS nao encontrados no portal ({len(criticos)})</h3>
    <ul>{criticos_html}</ul>
  </div>'''}

  <!-- Resumo por dimensao -->
  <div class="box">
    <h2>Resultado por Dimensao</h2>
    <table>
      <thead><tr>
        <th>Dimensao</th><th>Total</th><th>Encontrados</th><th>Ausentes</th><th>Progresso</th>
      </tr></thead>
      <tbody>{resumo_rows}</tbody>
    </table>
  </div>

  <!-- Tabela detalhada principal -->
  <div class="box">
    <h2>Detalhamento Completo — ID / Cartilha / Portal / URL</h2>
    <div style="overflow-x:auto">
    <table>
      <thead><tr>
        <th style="width:40px">OK?</th>
        <th style="width:50px">ID</th>
        <th>Item PNTP 2026</th>
        <th style="width:110px">Classificacao</th>
        <th>Secao na Cartilha PNTP 2026</th>
        <th>Onde encontrar no Portal</th>
        <th>URL no Portal</th>
      </tr></thead>
      <tbody>{detalhe_rows}</tbody>
    </table>
    </div>
  </div>

  <!-- Legenda -->
  <div class="box">
    <h2>Legenda e Metodologia</h2>
    <p style="line-height:1.8;font-size:13px">
      <strong>Classificacoes PNTP 2026:</strong><br>
      &nbsp;&nbsp;{badge('essencial')} — Item obrigatorio de maior peso avaliativo. Ausencia gera penalizacao severa no score.<br>
      &nbsp;&nbsp;{badge('obrigatório')} — Exigido pela LAI ou normativa complementar. Impacta o nivel do selo (Ouro/Prata/Bronze).<br>
      &nbsp;&nbsp;{badge('recomendado')} — Boa pratica recomendada pela cartilha. Contribui positivamente mas nao e eliminatorio.<br><br>
      <strong>Pesos da avaliacao PNTP:</strong> Atualidade 40% · Integralidade 40% · Serie Historica 20%<br><br>
      <strong>Fontes:</strong>
      <a href="https://radardatransparencia.atricon.org.br/pdf/Cartilha-PNTP-2026.pdf" target="_blank">
        Cartilha PNTP 2026 — Atricon</a> &nbsp;|&nbsp;
      <a href="{PORTAL_URL}" target="_blank">Portal Transparencia Osasco</a>
    </p>
  </div>

</div>
<footer>
  Script gerado por Claude Code &nbsp;|&nbsp;
  Portal: {PORTAL_URL} &nbsp;|&nbsp;
  Cartilha: radardatransparencia.atricon.org.br &nbsp;|&nbsp;
  {datetime.now().strftime("%d/%m/%Y")}
</footer>
</body>
</html>"""

    Path(arquivo).write_text(html, encoding="utf-8")
    print(f"\nRelatorio HTML gerado: {arquivo}")
    return arquivo


# ── Main ──────────────────────────────────────────────────────────────────────

async def main():
    print("=" * 65)
    print("  PNTP 2026 - Relatorio com URLs completas do portal")
    print("=" * 65)

    # 1. Carrega resultados anteriores (found/not found de cada critério)
    print("\nCarregando resultados da analise anterior...")
    resultados_ant = carregar_resultados_anteriores()

    # 2. Navega o portal para capturar URLs reais
    print("\nNavegando o portal para capturar URLs de cada secao...")
    url_map = await capturar_urls_portal()
    print(f"  {len(url_map)} secoes mapeadas")

    # 3. Monta lista final combinando MAPA_PNTP + resultados anteriores + url_map
    itens_final = []
    for item in MAPA_PNTP:
        it = dict(item)  # copia
        ant = resultados_ant.get(item["id"], {})
        it["encontrado"] = ant.get("encontrado", False)
        it["evidencia"] = ant.get("evidencia", "")
        it["termo_localizado"] = ant.get("termo_localizado", "")
        it["url_encontrada"] = ant.get("url_encontrada", "")
        it["observacao"] = ant.get("observacao", "")
        itens_final.append(it)

    # 4. Gera relatório HTML
    arquivo = gerar_html(itens_final, url_map, "relatorio_pntp_urls.html")

    total = len(itens_final)
    enc = sum(1 for i in itens_final if i.get("encontrado"))
    print(f"\nScore: {round(enc/total*100,1)}% ({enc}/{total})")
    print("Abra relatorio_pntp_urls.html no navegador.")


if __name__ == "__main__":
    asyncio.run(main())
