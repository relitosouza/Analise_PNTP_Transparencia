#!/usr/bin/env python3
"""
Relatorio PNTP 2026 x Osasco — design moderno com navegacao por secao,
filtros de status/peso e busca em tempo real. Zero dependencias externas.
"""
from datetime import datetime
from pathlib import Path

PORTAL_URL = "https://transparencia-osasco.smarapd.com.br"

CRITERIOS = [
  # ── 1. Informacoes Prioritarias ──────────────────────────────────────────
  {"id":"1.1","dim":"1. Informações Prioritárias","peso":"essencial","status":"ausente",
   "item":"Possui sítio oficial próprio na internet?",
   "obs":"Não verificado na análise automatizada","url":"","menu":""},
  {"id":"1.2","dim":"1. Informações Prioritárias","peso":"essencial","status":"ausente",
   "item":"Possui portal da transparência próprio ou compartilhado na internet?",
   "obs":"Não verificado na análise automatizada","url":"","menu":""},
  {"id":"1.3","dim":"1. Informações Prioritárias","peso":"essencial","status":"ausente",
   "item":"O acesso ao portal transparência está visível na capa do site?",
   "obs":"Não verificado na análise automatizada","url":"","menu":""},
  {"id":"1.4","dim":"1. Informações Prioritárias","peso":"obrigatorio","status":"ok",
   "item":"O site e o portal contêm ferramenta de pesquisa de conteúdo que permita o acesso à informação?",
   "obs":"Campo de busca visível na barra lateral e no topo",
   "url":PORTAL_URL,"menu":"Barra superior / campo de pesquisa"},

  # ── 2. Informacoes Institucionais ────────────────────────────────────────
  {"id":"2.1","dim":"2. Informações Institucionais","peso":"essencial","status":"ausente",
   "item":"Divulga a sua estrutura organizacional e a norma que a institui/altera?",
   "obs":"Organograma não localizado no portal","url":"","menu":"Administração Pública > Organograma"},
  {"id":"2.2","dim":"2. Informações Institucionais","peso":"essencial","status":"ausente",
   "item":"Divulga competências e/ou atribuições?",
   "obs":"Competências não localizadas","url":"","menu":"Administração Pública > Competências"},
  {"id":"2.3","dim":"2. Informações Institucionais","peso":"obrigatorio","status":"pendente",
   "item":"Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"2.4","dim":"2. Informações Institucionais","peso":"essencial","status":"ok",
   "item":"Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?",
   "obs":"Encontrado na página inicial",
   "url":PORTAL_URL+"/#/fixo/portal/inicio","menu":"Página inicial do portal"},
  {"id":"2.5","dim":"2. Informações Institucionais","peso":"essencial","status":"ausente",
   "item":"Divulga o horário de atendimento?",
   "obs":"Horário de atendimento não encontrado de forma explícita","url":"","menu":"Página inicial"},
  {"id":"2.6","dim":"2. Informações Institucionais","peso":"obrigatorio","status":"ok",
   "item":"Divulga os atos normativos próprios?",
   "obs":"Legislação e Imprensa Oficial disponível",
   "url":PORTAL_URL,"menu":"Legislação e Imprensa Oficial do Município"},
  {"id":"2.7","dim":"2. Informações Institucionais","peso":"recomendado","status":"ok",
   "item":"Divulga as perguntas e respostas mais frequentes relacionadas às atividades do Poder/Órgão?",
   "obs":"Link: FAQ","url":PORTAL_URL,"menu":"Sobre o Portal > FAQ / Glossário"},
  {"id":"2.8","dim":"2. Informações Institucionais","peso":"recomendado","status":"pendente",
   "item":"Participa em redes sociais e apresenta link de acesso ao seu perfil?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"2.9","dim":"2. Informações Institucionais","peso":"obrigatorio","status":"ok",
   "item":"Inclui botão do Radar da Transparência Pública no site institucional ou portal transparência?",
   "obs":"Encontrado via card/banner na página inicial",
   "url":"https://radardatransparencia.atricon.org.br/","menu":"Página inicial do portal"},

  # ── 3. Receita ───────────────────────────────────────────────────────────
  {"id":"3.1","dim":"3. Receita","peso":"essencial","status":"ok",
   "item":"Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?",
   "obs":"Receita Analítica disponível com histórico de 2020 a 2026",
   "url":PORTAL_URL+"/#/dinamico/receitas/receitaanalitica","menu":"Contas Públicas > Receitas > Receita Analítica"},
  {"id":"3.2","dim":"3. Receita","peso":"essencial","status":"ok",
   "item":"Divulga a classificação orçamentária por natureza da receita (categoria econômica, origem, espécie, desdobramento)?",
   "obs":"Link: Receita Corrente / Receita Capital","url":PORTAL_URL,"menu":"Contas Públicas > Receitas"},
  {"id":"3.3","dim":"3. Receita","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a lista dos inscritos em dívida ativa (nome do inscrito e valor total da dívida)?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 4. Despesa ───────────────────────────────────────────────────────────
  {"id":"4.1","dim":"4. Despesa","peso":"essencial","status":"ok",
   "item":"Divulga o total das despesas empenhadas, liquidadas e pagas?",
   "obs":"Empenhos, liquidações e pagamentos disponíveis",
   "url":PORTAL_URL,"menu":"Contas Públicas > Empenhos / Financeiro"},
  {"id":"4.2","dim":"4. Despesa","peso":"essencial","status":"ok",
   "item":"Divulga as despesas por classificação orçamentária?",
   "obs":"Despesas por categoria/elemento/função disponíveis",
   "url":PORTAL_URL,"menu":"Contas Públicas > Despesas Filtradas / Sintéticas"},
  {"id":"4.3","dim":"4. Despesa","peso":"essencial","status":"ausente",
   "item":"Possibilita a consulta de empenhos com detalhes do beneficiário, valor, bem/serviço e procedimento licitatório?",
   "obs":"Detalhamento completo do empenho não localizado","url":"","menu":"Contas Públicas > Empenhos"},
  {"id":"4.4","dim":"4. Despesa","peso":"obrigatorio","status":"pendente",
   "item":"Publica relação das despesas com aquisições de bens (bem, preço unitário, quantidade, fornecedor, valor total)?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"4.5","dim":"4. Despesa","peso":"recomendado","status":"pendente",
   "item":"Publica informações sobre despesas de patrocínio?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"4.6","dim":"4. Despesa","peso":"recomendado","status":"pendente",
   "item":"Publica informações detalhadas sobre execução dos contratos de publicidade?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 5. Convenios e Transferencias ────────────────────────────────────────
  {"id":"5.1","dim":"5. Convênios e Transferências","peso":"essencial","status":"ok",
   "item":"Divulga as transferências recebidas a partir de convênios/acordos (número, valor, objeto, vigência, concedente, inteiro teor)?",
   "obs":"Convênios celebrados encontrados","url":PORTAL_URL,"menu":"Terceiro Setor > Convênios"},
  {"id":"5.2","dim":"5. Convênios e Transferências","peso":"essencial","status":"ok",
   "item":"Divulga as transferências realizadas a partir de convênios/acordos/ajustes (beneficiário, objeto, valor, inteiro teor)?",
   "obs":"Repasses e Transferências disponíveis",
   "url":PORTAL_URL+"/#/dinamico/despesa_educacao/Repasses","menu":"Terceiro Setor | Repasses e Transferências"},
  {"id":"5.3","dim":"5. Convênios e Transferências","peso":"obrigatorio","status":"pendente",
   "item":"Divulga os acordos firmados que não envolvam transferência de recursos financeiros?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 6. Recursos Humanos ──────────────────────────────────────────────────
  {"id":"6.1","dim":"6. Recursos Humanos","peso":"essencial","status":"ausente",
   "item":"Divulga a relação nominal dos servidores/autoridades, cargos/funções, lotações e datas de admissão/exoneração?",
   "obs":"Quadro de servidores não localizado","url":"","menu":"Gestão de Pessoas > Quadro de Servidores"},
  {"id":"6.2","dim":"6. Recursos Humanos","peso":"essencial","status":"ok",
   "item":"Divulga a remuneração nominal de cada servidor/autoridade/Membro?",
   "obs":"Remuneração de servidores disponível","url":PORTAL_URL,"menu":"Gestão de Pessoas > Remuneração"},
  {"id":"6.3","dim":"6. Recursos Humanos","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a tabela com o padrão remuneratório dos cargos e funções?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"6.4","dim":"6. Recursos Humanos","peso":"recomendado","status":"ausente",
   "item":"Divulga a lista de seus estagiários (nome, data de contratação e término do contrato)?",
   "obs":"Estagiários não localizados no portal","url":"","menu":"Gestão de Pessoas > Estagiários"},
  {"id":"6.5","dim":"6. Recursos Humanos","peso":"obrigatorio","status":"ausente",
   "item":"Publica lista dos terceirizados (nome completo, função e empresa empregadora)?",
   "obs":"Terceirizados não localizados no portal","url":"","menu":"Gestão de Pessoas > Terceirizados"},
  {"id":"6.6","dim":"6. Recursos Humanos","peso":"obrigatorio","status":"ok",
   "item":"Divulga a íntegra dos editais de concursos e seleções públicas para provimento de cargos?",
   "obs":"Concursos públicos encontrados","url":PORTAL_URL,"menu":"Concursos e Processos Seletivos"},
  {"id":"6.7","dim":"6. Recursos Humanos","peso":"obrigatorio","status":"ok",
   "item":"Divulga informações sobre demais atos dos concursos (lista de aprovados, classificações, nomeações)?",
   "obs":"Informações de concursos públicos disponíveis","url":PORTAL_URL,"menu":"Concursos e Processos Seletivos"},

  # ── 7. Diarias ───────────────────────────────────────────────────────────
  {"id":"7.1","dim":"7. Diárias","peso":"essencial","status":"ausente",
   "item":"Divulga o nome e cargo do beneficiário, valor total, número de diárias, período, motivo e local de destino?",
   "obs":"Diárias e passagens não encontradas","url":"","menu":"Contas Públicas > Despesas com Viagens"},
  {"id":"7.2","dim":"7. Diárias","peso":"obrigatorio","status":"pendente",
   "item":"Divulga tabela que explicite os valores das diárias (dentro do Estado, fora e fora do país)?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 8. Licitacoes ────────────────────────────────────────────────────────
  {"id":"8.1","dim":"8. Licitações","peso":"essencial","status":"ausente",
   "item":"Divulga a relação das licitações em ordem sequencial (número, modalidade, objeto, data, valor, situação)?",
   "obs":"Relação de licitações não localizada","url":"","menu":"Licitações e Contratos > Resultados"},
  {"id":"8.2","dim":"8. Licitações","peso":"essencial","status":"ausente",
   "item":"Divulga a íntegra dos editais de licitação?",
   "obs":"Editais não localizados via busca","url":"","menu":"Licitações e Contratos > Editais"},
  {"id":"8.3","dim":"8. Licitações","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a íntegra dos demais documentos das fases interna e externa das licitações?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"8.4","dim":"8. Licitações","peso":"essencial","status":"ausente",
   "item":"Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade de licitação?",
   "obs":"Dispensas e inexigibilidades não localizadas","url":"","menu":"Licitações e Contratos > Dispensas"},
  {"id":"8.5","dim":"8. Licitações","peso":"obrigatorio","status":"ausente",
   "item":"Divulga a íntegra das Atas de Adesão – SRP?",
   "obs":"Atas de registro de preços não localizadas","url":"","menu":"Licitações e Contratos > Atas SRP"},
  {"id":"8.6","dim":"8. Licitações","peso":"obrigatorio","status":"ausente",
   "item":"Divulga o plano de contratações anual?",
   "obs":"PCA não localizado","url":"","menu":"Licitações e Contratos > PCA"},
  {"id":"8.7","dim":"8. Licitações","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a relação dos licitantes e/ou contratados sancionados administrativamente?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"8.8","dim":"8. Licitações","peso":"recomendado","status":"pendente",
   "item":"Divulga regulamento interno de licitações e contratos?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 9. Contratos ─────────────────────────────────────────────────────────
  {"id":"9.1","dim":"9. Contratos","peso":"essencial","status":"ok",
   "item":"Divulga a relação dos contratos celebrados em ordem sequencial (contratado, valor, objeto, vigência, aditivos)?",
   "obs":"Contratos e aditivos encontrados","url":PORTAL_URL,"menu":"Licitações e Contratos > Contratos"},
  {"id":"9.2","dim":"9. Contratos","peso":"essencial","status":"ausente",
   "item":"Divulga o inteiro teor dos contratos e dos respectivos termos aditivos?",
   "obs":"Inteiro teor dos contratos não localizado","url":"","menu":"Licitações e Contratos > Contratos"},
  {"id":"9.3","dim":"9. Contratos","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a relação/lista dos fiscais de cada contrato vigente e encerrado?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"9.4","dim":"9. Contratos","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a ordem cronológica de seus pagamentos e justificativas para eventual alteração?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 10. Obras ────────────────────────────────────────────────────────────
  {"id":"10.1","dim":"10. Obras","peso":"essencial","status":"ok",
   "item":"Divulga informações sobre as obras (objeto, situação, datas, empresa contratada, percentual concluído)?",
   "obs":"Obras em execução encontradas","url":PORTAL_URL,"menu":"Projetos e Obras"},
  {"id":"10.2","dim":"10. Obras","peso":"obrigatorio","status":"ausente",
   "item":"Divulga os quantitativos, os preços unitários e totais contratados?",
   "obs":"Quantitativos e preços de obras não localizados","url":"","menu":"Projetos e Obras > Quantitativos"},
  {"id":"10.3","dim":"10. Obras","peso":"obrigatorio","status":"pendente",
   "item":"Divulga os quantitativos executados e os preços efetivamente pagos?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"10.4","dim":"10. Obras","peso":"recomendado","status":"pendente",
   "item":"Divulga relação das obras paralisadas (motivo, responsável e data prevista para reinício)?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 11. Planejamento e Prestacao de Contas ───────────────────────────────
  {"id":"11.1","dim":"11. Planejamento e Prestação de Contas","peso":"essencial","status":"ok",
   "item":"Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?",
   "obs":"Prestação de Contas disponível","url":PORTAL_URL,"menu":"Contas Públicas > Prestação de Contas"},
  {"id":"11.2","dim":"11. Planejamento e Prestação de Contas","peso":"essencial","status":"ok",
   "item":"Divulga o Relatório de Gestão ou Atividades?",
   "obs":"Relatório de Gestão disponível no portal (verificado e corrigido)",
   "url":PORTAL_URL,"menu":"Contas Públicas > Relatório de Gestão"},
  {"id":"11.3","dim":"11. Planejamento e Prestação de Contas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a íntegra da decisão da apreciação ou julgamento das contas pelo Tribunal de Contas?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.4","dim":"11. Planejamento e Prestação de Contas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga o resultado do julgamento das Contas do Chefe do Poder Executivo pelo Poder Legislativo?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.5","dim":"11. Planejamento e Prestação de Contas","peso":"essencial","status":"ok",
   "item":"Divulga o Relatório de Gestão Fiscal (RGF)?",
   "obs":"Relatórios LRF disponíveis",
   "url":PORTAL_URL+"/#/fixo/loa/pecascontabeis","menu":"Contas Públicas > Relatórios LRF"},
  {"id":"11.6","dim":"11. Planejamento e Prestação de Contas","peso":"essencial","status":"ausente",
   "item":"Divulga o Relatório Resumido da Execução Orçamentária (RREO)?",
   "obs":"RREO não localizado explicitamente","url":"","menu":"Contas Públicas > Relatórios LRF"},
  {"id":"11.7","dim":"11. Planejamento e Prestação de Contas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga o plano estratégico institucional?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.8","dim":"11. Planejamento e Prestação de Contas","peso":"essencial","status":"ok",
   "item":"Divulga a Lei do Plano Plurianual (PPA) e seus anexos?",
   "obs":"Link PPA disponível","url":PORTAL_URL,"menu":"Peças Orçamentárias > PPA"},
  {"id":"11.9","dim":"11. Planejamento e Prestação de Contas","peso":"essencial","status":"ok",
   "item":"Divulga a Lei de Diretrizes Orçamentárias (LDO) e seus anexos?",
   "obs":"Link LDO disponível","url":PORTAL_URL,"menu":"Peças Orçamentárias > LDO"},
  {"id":"11.10","dim":"11. Planejamento e Prestação de Contas","peso":"essencial","status":"ok",
   "item":"Divulga a Lei Orçamentária (LOA) e seus anexos?",
   "obs":"Link LOA disponível",
   "url":PORTAL_URL+"/#/fixo/loa/pecascontabeis","menu":"Peças Orçamentárias > LOA"},
  {"id":"11.11","dim":"11. Planejamento e Prestação de Contas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga o Orçamento do Consórcio Público (estimativa de receita e fixação de despesa)?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.12","dim":"11. Planejamento e Prestação de Contas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga as demonstrações financeiras trimestrais?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.13","dim":"11. Planejamento e Prestação de Contas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga as demonstrações financeiras (contábeis) acompanhadas dos pareceres do Conselho Fiscal e da auditoria independente?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.14","dim":"11. Planejamento e Prestação de Contas","peso":"obrigatorio","status":"pendente",
   "item":"Publica o Orçamento de Investimentos da instituição que compõe a Lei Orçamentária Anual?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.15","dim":"11. Planejamento e Prestação de Contas","peso":"recomendado","status":"pendente",
   "item":"Divulga as demonstrações contábeis auditadas em formato eletrônico editável?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.16","dim":"11. Planejamento e Prestação de Contas","peso":"recomendado","status":"pendente",
   "item":"Divulga o relatório anual elaborado pelo Comitê de Auditoria Estatutário?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.17","dim":"11. Planejamento e Prestação de Contas","peso":"recomendado","status":"pendente",
   "item":"Divulga as atas das reuniões do Comitê de Auditoria Estatutário?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.18","dim":"11. Planejamento e Prestação de Contas","peso":"recomendado","status":"pendente",
   "item":"Divulga as atas das reuniões do Comitê de Elegibilidade Estatutário?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"11.19","dim":"11. Planejamento e Prestação de Contas","peso":"recomendado","status":"pendente",
   "item":"Divulga anualmente relatório integrado ou de sustentabilidade?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 12. SIC ──────────────────────────────────────────────────────────────
  {"id":"12.1","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"essencial","status":"ausente",
   "item":"Existe o SIC no site ou no portal de transparência e indica a unidade/setor responsável?",
   "obs":"SIC não localizado de forma explícita","url":"","menu":"Ouvidoria > SIC"},
  {"id":"12.2","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"essencial","status":"ausente",
   "item":"Indica o endereço físico, o telefone e o e-mail da unidade responsável pelo SIC, além do horário de funcionamento?",
   "obs":"Endereço e contato do SIC não localizados","url":"","menu":"Ouvidoria > SIC > Endereço"},
  {"id":"12.3","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"essencial","status":"ok",
   "item":"Há possibilidade de envio de pedidos de informação de forma eletrônica (e-SIC)?",
   "obs":"Link: Acesso ao e-SIC encontrado","url":PORTAL_URL,"menu":"Ouvidoria Geral > e-SIC"},
  {"id":"12.4","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"obrigatorio","status":"pendente",
   "item":"A solicitação por meio de e-SIC é simples, sem exigência de itens que dificultem o acesso?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"12.5","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"obrigatorio","status":"pendente",
   "item":"Divulga instrumento normativo local que regulamente a Lei nº 12.527/2011 – LAI?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"12.6","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"obrigatorio","status":"pendente",
   "item":"Divulga os prazos de resposta ao cidadão, incluindo o recursal, e as autoridades competentes?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"12.7","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"obrigatorio","status":"ausente",
   "item":"Divulga relatório anual estatístico com quantidade de pedidos de acesso recebidos, atendidos e indeferidos?",
   "obs":"Estatísticas específicas de pedidos LAI não localizadas","url":"","menu":"Sobre o Portal > Estatísticas LAI"},
  {"id":"12.8","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"obrigatorio","status":"ausente",
   "item":"Divulga lista de documentos classificados em cada grau de sigilo?",
   "obs":"Rol de informações sigilosas não localizado","url":"","menu":"Sobre o Portal > Rol de Sigilosas"},
  {"id":"12.9","dim":"12. Serviço de Informação ao Cidadão — SIC","peso":"obrigatorio","status":"pendente",
   "item":"Divulga lista das informações que tenham sido desclassificadas nos últimos 12 meses?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 13. Acessibilidade ───────────────────────────────────────────────────
  {"id":"13.1","dim":"13. Acessibilidade","peso":"obrigatorio","status":"ok",
   "item":"O site oficial e o portal de transparência contêm símbolo de acessibilidade em destaque?",
   "obs":"Barra de acessibilidade com símbolo presente","url":PORTAL_URL,"menu":"Barra superior do portal"},
  {"id":"13.2","dim":"13. Acessibilidade","peso":"recomendado","status":"pendente",
   "item":"O site e o portal contêm exibição do 'caminho' de páginas percorridas pelo usuário (breadcrumb)?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"13.3","dim":"13. Acessibilidade","peso":"recomendado","status":"ok",
   "item":"O site e o portal de transparência contêm opção de alto contraste?",
   "obs":"Opção de alto contraste disponível","url":PORTAL_URL,"menu":"Barra superior > Acessibilidade"},
  {"id":"13.4","dim":"13. Acessibilidade","peso":"recomendado","status":"ok",
   "item":"O site e o portal de transparência contêm ferramenta de redimensionamento de texto?",
   "obs":"Ferramenta de redimensionamento disponível","url":PORTAL_URL,"menu":"Barra superior > Acessibilidade"},
  {"id":"13.5","dim":"13. Acessibilidade","peso":"recomendado","status":"ausente",
   "item":"Contém mapa do site institucional?",
   "obs":"Mapa do site não localizado","url":"","menu":"Sobre o Portal > Mapa do Site"},

  # ── 14. Ouvidorias ───────────────────────────────────────────────────────
  {"id":"14.1","dim":"14. Ouvidorias","peso":"essencial","status":"ok",
   "item":"Há informações sobre o atendimento presencial pela Ouvidoria (endereço físico, telefone e horário)?",
   "obs":"Ouvidoria municipal encontrada","url":PORTAL_URL,"menu":"Ouvidoria Geral | Central 156"},
  {"id":"14.2","dim":"14. Ouvidorias","peso":"essencial","status":"ausente",
   "item":"Há canal eletrônico de acesso/interação com a ouvidoria?",
   "obs":"Canal eletrônico específico da ouvidoria não localizado","url":"","menu":"Ouvidoria > Canal Eletrônico"},
  {"id":"14.3","dim":"14. Ouvidorias","peso":"essencial","status":"ausente",
   "item":"Divulga Carta de Serviços ao Usuário?",
   "obs":"Carta de Serviços ao Usuário não localizada","url":"","menu":"Ouvidoria > Carta de Serviços"},

  # ── 15. LGPD e Governo Digital ───────────────────────────────────────────
  {"id":"15.1","dim":"15. LGPD e Governo Digital","peso":"obrigatorio","status":"pendente",
   "item":"Identifica o encarregado pelo tratamento de dados pessoais e disponibiliza canal de comunicação?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"15.2","dim":"15. LGPD e Governo Digital","peso":"obrigatorio","status":"pendente",
   "item":"Publica a sua Política de Privacidade e Proteção de Dados?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"15.3","dim":"15. LGPD e Governo Digital","peso":"obrigatorio","status":"pendente",
   "item":"Possibilita a demanda e o acesso a serviços públicos por meio digital, sem necessidade de solicitação presencial?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"15.4","dim":"15. LGPD e Governo Digital","peso":"recomendado","status":"ok",
   "item":"Possibilita o acesso automatizado por sistemas externos em dados abertos (estruturados e legíveis por máquina)?",
   "obs":"Dados abertos disponíveis","url":PORTAL_URL,"menu":"Dados Abertos"},
  {"id":"15.5","dim":"15. LGPD e Governo Digital","peso":"recomendado","status":"pendente",
   "item":"Regulamenta a Lei Federal nº 14.129/2021 (Governo Digital) e divulga a normativa em seu portal?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"15.6","dim":"15. LGPD e Governo Digital","peso":"recomendado","status":"pendente",
   "item":"Realiza e divulga resultados de pesquisas de satisfação?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 16. Renuncias de Receitas ─────────────────────────────────────────────
  {"id":"16.1","dim":"16. Renúncias de Receitas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga as desonerações tributárias concedidas e a fundamentação legal individualizada?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"16.2","dim":"16. Renúncias de Receitas","peso":"obrigatorio","status":"pendente",
   "item":"Divulga os valores da renúncia fiscal prevista e realizada, por tipo ou espécie de benefício?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"16.3","dim":"16. Renúncias de Receitas","peso":"obrigatorio","status":"pendente",
   "item":"Identifica os beneficiários das desonerações tributárias?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"16.4","dim":"16. Renúncias de Receitas","peso":"recomendado","status":"pendente",
   "item":"Divulga informações sobre projetos de incentivo à cultura (projetos aprovados, beneficiário e valor)?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 17. Emendas Parlamentares ─────────────────────────────────────────────
  {"id":"17.1","dim":"17. Emendas Parlamentares","peso":"obrigatorio","status":"ok",
   "item":"Identifica as emendas parlamentares federais recebidas (origem, repasse, tipo, número, autoria, valor, objeto)?",
   "obs":"Emendas parlamentares encontradas",
   "url":PORTAL_URL+"/#/dinamico/66/EmendasParlamentares","menu":"Emendas Parlamentares > Emendas Estadual e Federal"},
  {"id":"17.2","dim":"17. Emendas Parlamentares","peso":"obrigatorio","status":"ok",
   "item":"Identifica as emendas parlamentares estaduais e municipais recebidas?",
   "obs":"Emendas estaduais e municipais disponíveis",
   "url":PORTAL_URL+"/#/dinamico/66/EmendasParlamentares","menu":"Emendas Parlamentares"},
  {"id":"17.3","dim":"17. Emendas Parlamentares","peso":"obrigatorio","status":"pendente",
   "item":"Demonstra a execução orçamentária e financeira oriunda das emendas parlamentares?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 18. Saude ─────────────────────────────────────────────────────────────
  {"id":"18.1","dim":"18. Saúde","peso":"obrigatorio","status":"pendente",
   "item":"Divulga o plano de saúde, a programação anual e o relatório de gestão?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"18.2","dim":"18. Saúde","peso":"obrigatorio","status":"pendente",
   "item":"Divulga informações relacionadas aos serviços de saúde (horários, profissionais, especialidades e local)?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"18.3","dim":"18. Saúde","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a lista de espera de regulação para acesso às consultas, exames e serviços médicos?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"18.4","dim":"18. Saúde","peso":"obrigatorio","status":"pendente",
   "item":"Divulga lista dos medicamentos a serem fornecidos pelo SUS e informações de como obter?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"18.5","dim":"18. Saúde","peso":"recomendado","status":"pendente",
   "item":"Divulga os estoques de medicamentos das farmácias públicas?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"18.6","dim":"18. Saúde","peso":"recomendado","status":"pendente",
   "item":"Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Saúde?",
   "obs":"Não avaliado","url":"","menu":""},

  # ── 19. Educacao e Assistencia Social ────────────────────────────────────
  {"id":"19.1","dim":"19. Educação e Assistência Social","peso":"obrigatorio","status":"pendente",
   "item":"Divulga o plano de educação e o respectivo relatório de resultados?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"19.2","dim":"19. Educação e Assistência Social","peso":"obrigatorio","status":"pendente",
   "item":"Divulga a lista de espera em creches públicas e os critérios de priorização de acesso?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"19.3","dim":"19. Educação e Assistência Social","peso":"recomendado","status":"pendente",
   "item":"Divulga informações atualizadas sobre a composição e o funcionamento do Conselho do Fundeb?",
   "obs":"Não avaliado","url":"","menu":""},
  {"id":"19.4","dim":"19. Educação e Assistência Social","peso":"recomendado","status":"pendente",
   "item":"Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Assistência Social?",
   "obs":"Não avaliado","url":"","menu":""},
]

# ── Calculos ──────────────────────────────────────────────────────────────────
avaliados  = [c for c in CRITERIOS if c["status"] != "pendente"]
encontrados = [c for c in avaliados if c["status"] == "ok"]
ausentes    = [c for c in avaliados if c["status"] == "ausente"]
pendentes   = [c for c in CRITERIOS if c["status"] == "pendente"]
essenciais_faltando = [c for c in CRITERIOS if c["status"] == "ausente" and c["peso"] == "essencial"]
score = round(len(encontrados) / len(avaliados) * 100, 1) if avaliados else 0

# ── Agrupamento por dimensao ──────────────────────────────────────────────────
dims: dict[str, list] = {}
for c in CRITERIOS:
    dims.setdefault(c["dim"], []).append(c)

# ── Gera ID seguro para anchor HTML ──────────────────────────────────────────
def dim_id(dim: str) -> str:
    return "dim-" + dim.split(".")[0].strip().replace(" ", "-")

# ── Sidebar ───────────────────────────────────────────────────────────────────
sidebar_items = ""
for dim, lst in dims.items():
    av   = [x for x in lst if x["status"] != "pendente"]
    enc  = [x for x in av if x["status"] == "ok"]
    pct  = round(len(enc)/len(av)*100) if av else 0
    pend = sum(1 for x in lst if x["status"] == "pendente")
    color = "#27ae60" if pct >= 75 else ("#e67e22" if pct >= 40 else "#e74c3c")
    if not av: color = "#95a5a6"
    label = dim.split(". ", 1)[1] if ". " in dim else dim
    sidebar_items += f"""
    <a href="#{dim_id(dim)}" class="nav-item" data-dim="{dim_id(dim)}">
      <div class="nav-label">{dim.split(".")[0]}. {label}</div>
      <div class="nav-bar">
        <div class="nav-fill" style="width:{pct}%;background:{color}"></div>
      </div>
      <div class="nav-meta">
        <span style="color:{color}">{pct}%</span>
        <span class="nav-badges">
          {"" if not enc  else f'<span class="nb ok">{len(enc)}</span>'}
          {"" if not [x for x in av if x["status"]=="ausente"] else f'<span class="nb aus">{len([x for x in av if x["status"]=="ausente"])}</span>'}
          {"" if not pend else f'<span class="nb pend">{pend}</span>'}
        </span>
      </div>
    </a>"""

# ── Tabela de detalhe (JSON para JS) ─────────────────────────────────────────
import json as _json

rows_json = _json.dumps([{
    "id": c["id"],
    "dim": c["dim"],
    "did": dim_id(c["dim"]),
    "peso": c["peso"],
    "status": c["status"],
    "item": c["item"],
    "obs": c["obs"],
    "url": c["url"],
    "menu": c["menu"],
} for c in CRITERIOS], ensure_ascii=False)

# ── Resumo por dimensao ───────────────────────────────────────────────────────
summary_rows = ""
for dim, lst in dims.items():
    av   = [x for x in lst if x["status"] != "pendente"]
    enc  = [x for x in av if x["status"] == "ok"]
    aus  = [x for x in av if x["status"] == "ausente"]
    pend = [x for x in lst if x["status"] == "pendente"]
    pct  = round(len(enc)/len(av)*100) if av else 0
    color = "#27ae60" if pct >= 75 else ("#e67e22" if pct >= 40 else "#e74c3c")
    if not av: color = "#95a5a6"
    label = dim
    summary_rows += f"""
    <tr onclick="scrollToDim('{dim_id(dim)}')" style="cursor:pointer">
      <td style="padding:9px 14px;font-weight:600;color:#0a2340">{label}</td>
      <td style="padding:9px 8px;text-align:center">{len(lst)}</td>
      <td style="padding:9px 8px;text-align:center;color:#27ae60;font-weight:700">{len(enc)}</td>
      <td style="padding:9px 8px;text-align:center;color:#e74c3c;font-weight:700">{len(aus)}</td>
      <td style="padding:9px 8px;text-align:center;color:#95a5a6">{len(pend)}</td>
      <td style="padding:9px 14px;min-width:140px">
        <div style="background:#ecf0f1;border-radius:6px;height:10px;margin-bottom:3px;overflow:hidden">
          <div style="background:{color};width:{pct}%;height:10px"></div>
        </div>
        <span style="font-size:11px;color:{color};font-weight:700">{pct}%</span>
        {"" if av else '<span style="font-size:10px;color:#aaa"> (pendente)</span>'}
      </td>
    </tr>"""

# ── HTML ──────────────────────────────────────────────────────────────────────
html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PNTP 2026 × Transparência Osasco</title>
<style>
:root {{
  --navy:#0a2340; --blue:#1a6fbf; --green:#27ae60; --red:#e74c3c;
  --orange:#e67e22; --amber:#f39c12; --grey:#95a5a6;
  --bg:#f0f2f5; --card:#fff; --border:#e8ecf0;
  --sidebar-w:240px; --header-h:60px;
}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:#2c3e50;font-size:14px;
      display:flex;flex-direction:column;min-height:100vh}}

/* ── Header ── */
.top-header{{position:sticky;top:0;z-index:200;
  background:linear-gradient(135deg,var(--navy) 0%,#1a5fa0 100%);
  color:#fff;display:flex;align-items:center;gap:16px;
  padding:0 20px;height:var(--header-h);border-bottom:3px solid var(--amber);
  box-shadow:0 2px 12px rgba(0,0,0,.25)}}
.top-header h1{{font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.top-header .meta{{font-size:11px;opacity:.7;white-space:nowrap}}
.top-header a{{color:#7ecbff;text-decoration:none}}
.top-header a:hover{{text-decoration:underline}}
.spacer{{flex:1}}
.score-pill{{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);
  border-radius:20px;padding:4px 14px;font-size:13px;font-weight:700;white-space:nowrap}}

/* ── Layout ── */
.layout{{display:flex;flex:1;min-height:0}}

/* ── Sidebar ── */
.sidebar{{width:var(--sidebar-w);min-width:var(--sidebar-w);background:var(--card);
  border-right:1px solid var(--border);position:sticky;top:var(--header-h);
  height:calc(100vh - var(--header-h));overflow-y:auto;padding:12px 0;
  box-shadow:2px 0 8px rgba(0,0,0,.04)}}
.sidebar-title{{font-size:10px;font-weight:700;color:#aaa;letter-spacing:.8px;
  text-transform:uppercase;padding:0 14px 8px}}
.nav-item{{display:block;padding:8px 14px;text-decoration:none;color:inherit;
  border-left:3px solid transparent;transition:all .15s;cursor:pointer}}
.nav-item:hover,.nav-item.active{{background:#f0f4ff;border-left-color:var(--blue)}}
.nav-label{{font-size:12px;font-weight:600;color:#2c3e50;line-height:1.3;margin-bottom:4px}}
.nav-bar{{background:#ecf0f1;border-radius:3px;height:4px;margin-bottom:3px;overflow:hidden}}
.nav-fill{{height:4px;border-radius:3px;transition:width .3s}}
.nav-meta{{display:flex;align-items:center;justify-content:space-between}}
.nav-badges{{display:flex;gap:3px}}
.nb{{font-size:10px;font-weight:700;padding:1px 5px;border-radius:8px}}
.nb.ok  {{background:#d5f5e3;color:#1e8449}}
.nb.aus {{background:#fde8e4;color:#c0392b}}
.nb.pend{{background:#eaf2ff;color:#1a5276}}

/* ── Main ── */
.main{{flex:1;min-width:0;padding:20px 24px;overflow-x:hidden}}

/* ── Filtros ── */
.filter-bar{{background:var(--card);border-radius:12px;padding:14px 18px;
  margin-bottom:20px;box-shadow:0 1px 6px rgba(0,0,0,.07);
  display:flex;flex-wrap:wrap;gap:10px;align-items:center}}
.filter-bar input{{border:1px solid var(--border);border-radius:8px;padding:7px 12px;
  font-size:13px;outline:none;width:220px;transition:border .15s}}
.filter-bar input:focus{{border-color:var(--blue)}}
.filter-bar label{{font-size:12px;font-weight:600;color:#666}}
.chips{{display:flex;gap:6px;flex-wrap:wrap}}
.chip{{border:1.5px solid var(--border);border-radius:20px;padding:4px 12px;
  font-size:11px;font-weight:600;cursor:pointer;background:#fff;transition:all .15s;
  user-select:none}}
.chip:hover{{background:#f0f4ff;border-color:var(--blue)}}
.chip.active{{color:#fff;border-color:transparent}}
.chip.c-ok{{background:#27ae60;border-color:#27ae60;color:#fff}}
.chip.c-aus{{background:#e74c3c;border-color:#e74c3c;color:#fff}}
.chip.c-pend{{background:#95a5a6;border-color:#95a5a6;color:#fff}}
.chip.c-ess{{background:#c0392b;border-color:#c0392b;color:#fff}}
.chip.c-obr{{background:#b7770d;border-color:#b7770d;color:#fff}}
.chip.c-rec{{background:#1a5276;border-color:#1a5276;color:#fff}}
#result-count{{font-size:12px;color:#95a5a6;margin-left:auto}}

/* ── KPI cards ── */
.kpi-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
  gap:12px;margin-bottom:20px}}
.kpi{{background:var(--card);border-radius:12px;padding:16px;text-align:center;
  box-shadow:0 1px 6px rgba(0,0,0,.06);border-top:3px solid transparent}}
.kpi .val{{font-size:32px;font-weight:800;line-height:1.1}}
.kpi .lbl{{font-size:11px;color:#7f8c8d;margin-top:4px;line-height:1.4}}
.kpi.k-score{{border-top-color:var(--blue)}}
.kpi.k-ok   {{border-top-color:var(--green)}}
.kpi.k-aus  {{border-top-color:var(--red)}}
.kpi.k-pend {{border-top-color:var(--grey)}}
.kpi.k-ess  {{border-top-color:var(--amber)}}

/* ── Alert ── */
.alert-box{{background:#fff8e1;border-left:4px solid var(--amber);padding:14px 18px;
  border-radius:0 10px 10px 0;margin-bottom:20px}}
.alert-box h3{{color:#856404;font-size:13px;margin-bottom:8px}}
.alert-box ul{{padding-left:18px}}
.alert-box li{{font-size:12px;color:#444;margin-bottom:5px;padding-bottom:5px;
  border-bottom:1px dashed #eee}}
.alert-box li:last-child{{border:none;margin:0;padding:0}}

/* ── Resumo tabela ── */
.box{{background:var(--card);border-radius:12px;padding:18px 20px;
  margin-bottom:20px;box-shadow:0 1px 6px rgba(0,0,0,.06)}}
.box h2{{font-size:14px;font-weight:700;color:var(--navy);margin-bottom:14px;
  padding-bottom:10px;border-bottom:2px solid var(--border);display:flex;align-items:center;gap:8px}}
.box h2 .badge-count{{background:#eaf2ff;color:var(--blue);font-size:11px;font-weight:700;
  padding:2px 8px;border-radius:10px}}
table.summary{{width:100%;border-collapse:collapse}}
table.summary thead th{{background:var(--navy);color:#fff;padding:9px 12px;
  font-size:11px;text-align:left;white-space:nowrap}}
table.summary tbody tr:hover{{background:#f6f8fb}}
table.summary tbody tr:nth-child(even){{background:#fafbfc}}

/* ── Secoes de dimensao ── */
.dim-section{{background:var(--card);border-radius:12px;margin-bottom:14px;
  box-shadow:0 1px 6px rgba(0,0,0,.06);overflow:hidden;
  transition:box-shadow .2s}}
.dim-section:hover{{box-shadow:0 3px 12px rgba(0,0,0,.1)}}
.dim-header{{display:flex;align-items:center;gap:12px;padding:14px 18px;
  cursor:pointer;border-bottom:1px solid var(--border);
  background:linear-gradient(to right,#f8fafc,#fff);user-select:none}}
.dim-header:hover{{background:#f0f4ff}}
.dim-title{{font-size:14px;font-weight:700;color:var(--navy);flex:1}}
.dim-prog{{display:flex;align-items:center;gap:8px}}
.dim-prog .bar{{width:80px;height:8px;background:#ecf0f1;border-radius:4px;overflow:hidden}}
.dim-prog .fill{{height:8px;border-radius:4px;transition:width .3s}}
.dim-prog .pct{{font-size:12px;font-weight:700;min-width:36px;text-align:right}}
.dim-badges{{display:flex;gap:5px}}
.db{{font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px}}
.db.ok  {{background:#d5f5e3;color:#1e8449}}
.db.aus {{background:#fde8e4;color:#c0392b}}
.db.pend{{background:#eaf2ff;color:#1a5276}}
.chevron{{font-size:12px;color:#aaa;transition:transform .2s}}
.dim-section.collapsed .chevron{{transform:rotate(-90deg)}}
.dim-body{{overflow:hidden;transition:max-height .3s ease}}
.dim-section.collapsed .dim-body{{max-height:0!important}}

/* ── Linhas de criterio ── */
.c-row{{display:grid;grid-template-columns:40px 52px 1fr 110px;align-items:start;
  padding:12px 16px;border-bottom:1px solid var(--border);gap:8px;
  transition:background .12s}}
.c-row:last-child{{border-bottom:none}}
.c-row:hover{{background:#f8f9fb}}
.c-row.st-ok   {{border-left:4px solid #a9dfbf;background:#f0fff4}}
.c-row.st-aus  {{border-left:4px solid #f1948a;background:#fff8f8}}
.c-row.st-pend {{border-left:4px solid #ced4da;background:#f8f9fa}}
.c-row:hover.st-ok   {{background:#e8f8ef}}
.c-row:hover.st-aus  {{background:#fff0ee}}
.c-row:hover.st-pend {{background:#f2f3f5}}
.icon{{font-size:18px;font-weight:700;text-align:center;padding-top:2px}}
.icon.ok  {{color:var(--green)}}
.icon.aus {{color:var(--red)}}
.icon.pend{{color:var(--grey);font-size:14px}}
.c-id{{font-size:12px;font-weight:800;color:var(--navy);white-space:nowrap;padding-top:2px}}
.c-body{{min-width:0}}
.c-item{{font-size:13px;font-weight:600;color:#2c3e50;line-height:1.4;margin-bottom:4px}}
.c-obs{{font-size:11px;color:#7f8c8d;margin-bottom:3px}}
.c-url a{{font-size:11px;color:#1a5276;word-break:break-all;font-family:'Courier New',monospace;
  text-decoration:none}}
.c-url a:hover{{text-decoration:underline}}
.c-menu{{font-size:10px;color:#aaa;margin-top:2px}}
.badge{{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;
  border:1px solid;white-space:nowrap}}
.b-ess{{background:#fdecea;color:#c0392b;border-color:#c0392b}}
.b-obr{{background:#fef9e7;color:#b7770d;border-color:#b7770d}}
.b-rec{{background:#eaf2ff;color:#1a5276;border-color:#1a5276}}

/* ── Hidden ── */
.hidden{{display:none!important}}

/* ── Sem resultados ── */
.no-results{{text-align:center;padding:40px;color:#aaa;font-size:13px}}

/* ── Footer ── */
footer{{text-align:center;padding:16px;color:#bbb;font-size:11px;background:#fff;
  border-top:1px solid var(--border)}}

/* ── Scrollbar sidebar ── */
.sidebar::-webkit-scrollbar{{width:4px}}
.sidebar::-webkit-scrollbar-thumb{{background:#ddd;border-radius:2px}}

@media(max-width:768px){{
  .sidebar{{display:none}}
  .main{{padding:12px}}
  .c-row{{grid-template-columns:32px 44px 1fr}}
  .c-row > :last-child{{grid-column:2/-1;padding-top:4px}}
}}
</style>
</head>
<body>

<header class="top-header">
  <h1>&#128203; PNTP 2026 &times; Portal de Transparência de Osasco</h1>
  <div class="meta">
    <a href="https://radardatransparencia.atricon.org.br/pdf/Cartilha-PNTP-2026.pdf" target="_blank">Cartilha PNTP 2026</a>
    &nbsp;|&nbsp;
    <a href="{PORTAL_URL}" target="_blank">transparencia-osasco</a>
    &nbsp;|&nbsp; {datetime.now().strftime("%d/%m/%Y")}
  </div>
  <div class="spacer"></div>
  <div class="score-pill">{score}% ({len(encontrados)}/{len(avaliados)} avaliados)</div>
</header>

<div class="layout">

  <!-- Sidebar -->
  <nav class="sidebar">
    <div class="sidebar-title">Dimensões PNTP 2026</div>
    {sidebar_items}
  </nav>

  <!-- Conteúdo principal -->
  <main class="main">

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi k-score">
        <div class="val" style="color:{'#27ae60' if score>=75 else '#e67e22' if score>=40 else '#e74c3c'}">{score}%</div>
        <div class="lbl">Score<br><small>(itens avaliados)</small></div>
      </div>
      <div class="kpi">
        <div class="val" style="color:#2c3e50">{len(CRITERIOS)}</div>
        <div class="lbl">Total critérios<br>PNTP 2026</div>
      </div>
      <div class="kpi k-ok">
        <div class="val" style="color:#27ae60">{len(encontrados)}</div>
        <div class="lbl">Encontrados<br>no portal</div>
      </div>
      <div class="kpi k-aus">
        <div class="val" style="color:#e74c3c">{len(ausentes)}</div>
        <div class="lbl">Ausentes<br>no portal</div>
      </div>
      <div class="kpi k-pend">
        <div class="val" style="color:#95a5a6">{len(pendentes)}</div>
        <div class="lbl">Pendentes<br>de análise</div>
      </div>
      <div class="kpi k-ess">
        <div class="val" style="color:#e74c3c">{len(essenciais_faltando)}</div>
        <div class="lbl">Essenciais<br>ausentes</div>
      </div>
    </div>

    <!-- Alerta essenciais -->
    {"" if not essenciais_faltando else f'''
    <div class="alert-box">
      <h3>&#9888; Itens ESSENCIAIS ausentes ({len(essenciais_faltando)}) — maior risco de penalização:</h3>
      <ul>{''.join(f"""<li><strong>[{c['id']}]</strong> {c['item']} <em style="color:#888">({c['dim']})</em></li>""" for c in essenciais_faltando)}</ul>
    </div>'''}

    <!-- Resumo por dimensao -->
    <div class="box">
      <h2>Resultado por Dimensão <span class="badge-count">{len(dims)} grupos</span></h2>
      <div style="overflow-x:auto">
      <table class="summary">
        <thead><tr>
          <th>Dimensão</th><th>Total</th>
          <th style="color:#a9dfbf">&#10003; Disp.</th>
          <th style="color:#f1948a">&#10007; Aus.</th>
          <th style="color:#ced4da">&#9679; Pend.</th>
          <th>Score (avaliados)</th>
        </tr></thead>
        <tbody>{summary_rows}</tbody>
      </table>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filter-bar">
      <label>Filtrar:</label>
      <input type="search" id="q" placeholder="&#128269; Buscar critério, ID ou dimensão…" oninput="applyFilters()">
      <div class="chips" id="chips-status">
        <span class="chip active" data-val="" onclick="setChip(this,'status')">Todos status</span>
        <span class="chip c-ok"  data-val="ok"      onclick="setChip(this,'status')">&#10003; Disponível</span>
        <span class="chip c-aus" data-val="ausente"  onclick="setChip(this,'status')">&#10007; Ausente</span>
        <span class="chip c-pend" data-val="pendente" onclick="setChip(this,'status')">&#9679; Pendente</span>
      </div>
      <div class="chips" id="chips-peso">
        <span class="chip active" data-val="" onclick="setChip(this,'peso')">Todos tipos</span>
        <span class="chip c-ess"  data-val="essencial"   onclick="setChip(this,'peso')">Essencial</span>
        <span class="chip c-obr"  data-val="obrigatorio" onclick="setChip(this,'peso')">Obrigatório</span>
        <span class="chip c-rec"  data-val="recomendado" onclick="setChip(this,'peso')">Recomendado</span>
      </div>
      <span id="result-count"></span>
    </div>

    <!-- Secoes por dimensao (geradas por JS) -->
    <div id="dims-container"></div>
    <div id="no-results" class="no-results hidden">
      &#128269; Nenhum critério encontrado com os filtros selecionados.
    </div>

  </main>
</div>

<footer>
  Relatório PNTP 2026 × Portal de Transparência de Osasco &nbsp;|&nbsp;
  Grupos 1–19 (Administração Municipal / Poder Executivo) &nbsp;|&nbsp;
  {len(CRITERIOS)} critérios &nbsp;|&nbsp; Gerado em {datetime.now().strftime("%d/%m/%Y às %H:%M")}
</footer>

<script>
const ROWS = {rows_json};

const DIMS = [...new Set(ROWS.map(r=>r.dim))];
const DIM_IDS = {{}};
DIMS.forEach(d=>{{ DIM_IDS[d] = 'dim-' + d.split('.')[0].trim().replace(/\\s+/g,'-'); }});

let fStatus='', fPeso='', fQ='';

function badgeClass(peso){{
  return {{essencial:'b-ess',obrigatorio:'b-obr',recomendado:'b-rec'}}[peso]||'b-obr';
}}
function badgeLabel(peso){{
  return {{essencial:'ESSENCIAL',obrigatorio:'OBRIGATÓRIO',recomendado:'RECOMENDADO'}}[peso]||peso.toUpperCase();
}}
function iconHtml(st){{
  if(st==='ok')    return '<span class="icon ok">&#10003;</span>';
  if(st==='ausente') return '<span class="icon aus">&#10007;</span>';
  return '<span class="icon pend">&#9679;</span>';
}}
function urlHtml(row){{
  if(row.url) return `<div class="c-url"><a href="${{row.url}}" target="_blank">${{row.url}}</a></div>`
    +(row.menu?`<div class="c-menu">&#128193; ${{row.menu}}</div>`:'');
  if(row.menu) return `<div class="c-menu" style="color:#bbb">&#128193; ${{row.menu}}</div>`;
  return '<div class="c-menu" style="color:#ccc">— a avaliar —</div>';
}}

function buildDims(){{
  const container = document.getElementById('dims-container');
  container.innerHTML='';
  DIMS.forEach(dim=>{{
    const id = DIM_IDS[dim];
    const sec = document.createElement('div');
    sec.className='dim-section';
    sec.id=id;
    // calc stats
    const lst = ROWS.filter(r=>r.dim===dim);
    const av  = lst.filter(r=>r.status!=='pendente');
    const enc = av.filter(r=>r.status==='ok');
    const aus = av.filter(r=>r.status==='ausente');
    const pend= lst.filter(r=>r.status==='pendente');
    const pct = av.length ? Math.round(enc.length/av.length*100) : 0;
    const color = av.length===0 ? '#95a5a6' : pct>=75?'#27ae60':pct>=40?'#e67e22':'#e74c3c';
    const dbOk   = enc.length  ? `<span class="db ok">${{enc.length}} &#10003;</span>` : '';
    const dbAus  = aus.length  ? `<span class="db aus">${{aus.length}} &#10007;</span>` : '';
    const dbPend = pend.length ? `<span class="db pend">${{pend.length}} &#9679;</span>` : '';
    sec.innerHTML=`
      <div class="dim-header" onclick="toggleSection(this.parentElement)">
        <div class="dim-title">${{dim}}</div>
        <div class="dim-prog">
          <div class="bar"><div class="fill" style="width:${{pct}}%;background:${{color}}"></div></div>
          <div class="pct" style="color:${{color}}">${{av.length?pct+'%':'—'}}</div>
        </div>
        <div class="dim-badges">${{dbOk}}${{dbAus}}${{dbPend}}</div>
        <span class="chevron">&#9660;</span>
      </div>
      <div class="dim-body" id="body-${{id}}">
        <div class="rows-wrap" id="rows-${{id}}"></div>
      </div>`;
    container.appendChild(sec);
  }});
}}

function renderRows(){{
  const q = fQ.toLowerCase();
  let total=0, shown=0;
  DIMS.forEach(dim=>{{
    const id=DIM_IDS[dim];
    const wrap=document.getElementById('rows-'+id);
    if(!wrap) return;
    wrap.innerHTML='';
    const lst=ROWS.filter(r=>r.dim===dim);
    let dimShown=0;
    lst.forEach(r=>{{
      total++;
      if(fStatus && r.status!==fStatus) return;
      if(fPeso   && r.peso!==fPeso)     return;
      if(q && !(r.id.includes(q)||r.item.toLowerCase().includes(q)||r.dim.toLowerCase().includes(q)||r.obs.toLowerCase().includes(q))) return;
      shown++;
      dimShown++;
      const div=document.createElement('div');
      div.className=`c-row st-${{r.status}}`;
      div.dataset.status=r.status;
      div.dataset.peso=r.peso;
      div.dataset.dim=r.dim;
      div.innerHTML=`
        ${{iconHtml(r.status)}}
        <div class="c-id">${{r.id}}</div>
        <div class="c-body">
          <div class="c-item">${{r.item}}</div>
          ${{r.obs?`<div class="c-obs">${{r.obs}}</div>`:''}}
          ${{urlHtml(r)}}
        </div>
        <div style="padding-top:2px"><span class="badge ${{badgeClass(r.peso)}}">${{badgeLabel(r.peso)}}</span></div>`;
      wrap.appendChild(div);
    }});
    // show/hide section based on filter
    const sec=document.getElementById(id);
    if(sec){{
      if(dimShown===0 && (fStatus||fPeso||q)){{
        sec.classList.add('hidden');
      }} else {{
        sec.classList.remove('hidden');
        // auto-expand if filtering
        if((fStatus||fPeso||q) && dimShown>0){{
          sec.classList.remove('collapsed');
          const body=document.getElementById('body-'+id);
          if(body) body.style.maxHeight='';
        }}
      }}
    }}
  }});
  document.getElementById('result-count').textContent =
    q||fStatus||fPeso ? `${{shown}} critério${{shown!==1?'s':''}} exibido${{shown!==1?'s':''}}` : '';
  document.getElementById('no-results').classList.toggle('hidden', shown>0||(!(q||fStatus||fPeso)));
}}

function toggleSection(sec){{
  sec.classList.toggle('collapsed');
  const body=sec.querySelector('.dim-body');
  if(sec.classList.contains('collapsed')){{
    body.style.maxHeight=body.scrollHeight+'px';
    requestAnimationFrame(()=>{{ body.style.maxHeight='0'; }});
  }} else {{
    body.style.maxHeight='0';
    requestAnimationFrame(()=>{{ body.style.maxHeight=body.scrollHeight+'px'; }});
    setTimeout(()=>{{ body.style.maxHeight=''; }},300);
  }}
}}

function setChip(el,group){{
  document.querySelectorAll('#chips-'+group+' .chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  if(group==='status') fStatus=el.dataset.val;
  else fPeso=el.dataset.val;
  applyFilters();
}}

function applyFilters(){{
  fQ=document.getElementById('q').value;
  renderRows();
}}

function scrollToDim(id){{
  const el=document.getElementById(id);
  if(el){{
    el.scrollIntoView({{behavior:'smooth',block:'start'}});
    el.classList.remove('collapsed');
    const body=el.querySelector('.dim-body');
    if(body) body.style.maxHeight='';
  }}
}}

// Sidebar active link on scroll
const observer=new IntersectionObserver(entries=>{{
  entries.forEach(e=>{{
    if(e.isIntersecting){{
      document.querySelectorAll('.nav-item').forEach(a=>a.classList.remove('active'));
      const link=document.querySelector(`.nav-item[data-dim="${{e.target.id}}"]`);
      if(link){{
        link.classList.add('active');
        link.scrollIntoView({{block:'nearest'}});
      }}
    }}
  }});
}},{{rootMargin:'-10% 0px -80% 0px'}});

window.addEventListener('load',()=>{{
  buildDims();
  renderRows();
  DIMS.forEach(dim=>{{
    const el=document.getElementById(DIM_IDS[dim]);
    if(el) observer.observe(el);
  }});
}});
</script>
</body>
</html>"""

Path("relatorio_pntp_urls.html").write_text(html, encoding="utf-8")
print(f"Relatorio gerado: relatorio_pntp_urls.html")
print(f"  {len(CRITERIOS)} criterios | {len(encontrados)} ok | {len(ausentes)} ausentes | {len(pendentes)} pendentes")
print(f"  Score: {score}% | Essenciais ausentes: {len(essenciais_faltando)}")
