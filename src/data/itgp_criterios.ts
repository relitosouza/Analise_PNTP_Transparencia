export type PesoITGP = 'essencial' | 'obrigatorio' | 'recomendado';

export interface CriterioITGP {
  id: string;
  dimensao: string;
  texto: string;
  peso: PesoITGP;
}

export interface DimensaoITGP {
  titulo: string;
  criterios: CriterioITGP[];
}

const dimensoesRaw: { titulo: string; itens: [string, string, PesoITGP][] }[] = [
  {
    titulo: '1. Dimensão Legal',
    itens: [
      ['L01', 'Possui norma de regulamentação da Lei nº 12.527/2011 (Lei de Acesso à Informação - LAI)?', 'essencial'],
      ['L02', 'Possui norma sobre dados abertos ou Plano de Dados Abertos (PDA) em vigência?', 'essencial'],
      ['L03', 'Possui regulamentação de conflitos de interesses?', 'essencial'],
      ['L04', 'Possui norma de proteção ao denunciante?', 'essencial'],
      ['L05', 'Possui regulamentação da LGPD (Lei nº 13.709/2018) e concluiu o processo de adequação (encarregado, contatos e governança)?', 'essencial'],
      ['L06', 'Possui regulamentação municipal da Lei Anticorrupção (Lei nº 12.846/2013)?', 'essencial'],
    ],
  },
  {
    titulo: '2. Dimensão: Plataformas',
    itens: [
      ['P01', 'Possui Portal da Transparência em destaque no portal principal?', 'essencial'],
      ['P02', 'Possui Portal de Dados Abertos em destaque no portal principal?', 'essencial'],
      ['P03', 'Possui canal de acesso à informação em destaque no site principal?', 'essencial'],
      ['P04', 'Possui canal de ouvidoria em destaque no site principal?', 'essencial'],
      ['P05', 'Possui canal para denúncias de corrupção anônimas em destaque no site principal?', 'essencial'],
      ['P06', 'Possui Diário Oficial online em destaque (e em formato aberto)?', 'essencial'],
      ['P07', 'O serviço eletrônico de acesso à informação permite acompanhamento, protocolo, recursos e protege a identidade do requerente?', 'essencial'],
      ['P08', 'Publica relatórios estatísticos de acesso à informação atualizados trimestralmente?', 'essencial'],
      ['P09', 'Publica relatórios estatísticos de ouvidoria atualizados trimestralmente?', 'essencial'],
      ['P10', 'Disponibiliza ferramentas de acessibilidade (símbolo, Libras, contraste, leitores de tela)?', 'essencial'],
      ['P11', 'Promove visualizações de dados (dashboards, gráficos) nos portais?', 'essencial'],
    ],
  },
  {
    titulo: '3. Dimensão: Governança e Administrativo',
    itens: [
      ['AG01', 'Divulga informações sobre estrutura (organograma, funções e contatos)?', 'essencial'],
      ['AG02', 'Divulga agenda diária do chefe do executivo de forma antecipada?', 'essencial'],
      ['AG03', 'Possui órgão de controle interno com atribuições de transparência, auditoria e combate à corrupção?', 'essencial'],
      ['AG04', 'O órgão de controle interno está no primeiro ou segundo escalão do governo?', 'essencial'],
      ['AG05', 'O órgão de controle interno possui servidores efetivos?', 'essencial'],
      ['AG06', 'Realiza planejamento anual de auditorias?', 'essencial'],
      ['AG07', 'Publica pareceres ou relatórios de auditoria interna anualmente?', 'essencial'],
      ['AG08', 'Publica pareceres ou relatórios de órgãos de controle externo (Tribunal de Contas/MP)?', 'essencial'],
      ['AG09', 'Divulga anualmente o cumprimento das metas do Plano Plurianual (PPA)?', 'essencial'],
      ['AG10', 'Divulga o Código de Ética ou Conduta dos servidores em destaque?', 'essencial'],
    ],
  },
  {
    titulo: '4. Dimensão: Obras Públicas',
    itens: [
      ['OBR01', 'Possui plataforma para acompanhamento financeiro de obras (empenhos, medições)?', 'essencial'],
      ['OBR02', 'A plataforma inclui localização, imagens, contatos, prazos, atrasos e execução física?', 'essencial'],
      ['OBR03', 'Publica o Plano de Contratações Anual de forma centralizada?', 'essencial'],
      ['OBR04', 'Publica informações sobre os fiscais dos contratos (nome, registro/CPF)?', 'essencial'],
      ['OBR05', 'Publica estudos de impacto (EIA/RIMA ou EIV) das obras?', 'essencial'],
      ['OBR06', 'Publica informações centralizadas sobre licenças ambientais emitidas?', 'essencial'],
      ['OBR07', 'Publica informações sobre audiências ou consultas públicas para editais de obras?', 'essencial'],
    ],
  },
  {
    titulo: '5. Dimensão: Transparência Financeira e Orçamentária',
    itens: [
      ['TF001', 'Publica base de dados aberta, para download e com série histórica sobre salários nominais?', 'essencial'],
      ['TF002', 'Publica base de dados aberta, para download e com série histórica sobre verbas indenizatórias?', 'essencial'],
      ['TF003', 'Publica base de dados aberta, para download e com série histórica sobre benefícios por terceiros?', 'essencial'],
      ['TF004', 'Publica base de dados aberta, para download e com série histórica sobre doações recebidas?', 'essencial'],
      ['TF005', 'Publica base de dados aberta, para download e com série histórica sobre receitas?', 'essencial'],
      ['TF006', 'Publica base de dados aberta, para download e com série histórica sobre receitas por unidade gestora?', 'essencial'],
      ['TF007', 'Publica base de dados aberta, para download e com série histórica sobre despesas?', 'essencial'],
      ['TF008', 'Detalha despesas por unidade, categoria, grupo, função e empenho?', 'essencial'],
      ['TF009', 'Publica base de dados aberta sobre incentivos fiscais?', 'essencial'],
      ['TF010', 'Publica base de dados aberta sobre transferências obrigatórias?', 'essencial'],
      ['TF011', 'Publica base de dados aberta sobre transferências voluntárias?', 'essencial'],
      ['TF012', 'Publica base de dados aberta sobre licitações?', 'essencial'],
      ['TF013', 'Divulga detalhes das licitações (modalidade, valor, empresas participantes, vencedora, etc)?', 'essencial'],
      ['TF014', 'Publica bases abertas de contratos com detalhamento completo (vigência, valores, íntegra dos documentos)?', 'essencial'],
      ['TF015', 'Publica bases abertas de aditivos com detalhamento completo (vigência, valores, íntegra dos documentos)?', 'essencial'],
      ['TF016', 'Publica bases abertas de contratos emergenciais com detalhamento de datas, objeto e valores (TF016)?', 'essencial'],
      ['TF017', 'Publica bases abertas de contratos emergenciais com detalhamento de datas, objeto e valores (TF017)?', 'essencial'],
      ['TF018', 'Divulga informações sobre parcerias com o Marco Regulatório das Organizações da Sociedade Civil (MROSC)?', 'essencial'],
      ['TF019', 'Publica base de dados sobre patrimônio público (bens imóveis)?', 'essencial'],
      ['TF020', 'Publica base de dados sobre emendas parlamentares municipais?', 'essencial'],
      ['TF021', 'Detalha repasses e estágios das emendas parlamentares municipais?', 'essencial'],
      ['TF022', 'Divulga base sobre emendas estaduais/federais?', 'essencial'],
      ['TF023', 'Divulga base sobre transferências especiais ("emendas pix")?', 'essencial'],
      ['TF024', 'Utiliza sistema de compras eletrônicas com registro de preços, cadastro de fornecedores e manuais?', 'essencial'],
      ['TF025', 'Divulga Relatório Resumido de Execução Orçamentária (RREO)?', 'essencial'],
      ['TF026', 'Divulga Relatório de Gestão Fiscal (RGF)?', 'essencial'],
      ['TF027', 'Divulga relatórios da dívida pública?', 'essencial'],
    ],
  },
  {
    titulo: '6. Dimensão: Comunicação, Engajamento e Participação',
    itens: [
      ['CEP01', 'Possui página centralizada com informações sobre conselhos de políticas públicas ativos?', 'essencial'],
      ['CEP02', 'Possui Conselho de Transparência ou Combate à Corrupção ativo?', 'essencial'],
      ['CEP03', 'Publica sistema de gerenciamento eletrônico de documentos e processos públicos?', 'essencial'],
      ['CEP04', 'Possui redes sociais ativas?', 'essencial'],
      ['CEP05', 'Possui área de notícias no portal atualizada?', 'essencial'],
      ['CEP06', 'Oferece oportunidades de participação na discussão do orçamento anualmente?', 'essencial'],
      ['CEP07', 'Publica informações sobre consultas públicas realizadas no último ano?', 'essencial'],
      ['CEP08', 'Publica informações sobre audiências públicas realizadas no último ano?', 'essencial'],
      ['CEP09', 'Divulga Carta de Serviços aos Cidadãos atualizada semestralmente?', 'essencial'],
      ['CEP10', 'Possibilita o agendamento ou prestação digital de serviços públicos?', 'essencial'],
    ],
  },
  {
    titulo: '7. Dimensão: Saúde (Indicadores Específicos)',
    itens: [
      ['S-P01', 'Possui destaque ao portal da Saúde no site principal?', 'essencial'],
      ['S-P02', 'Disponibiliza dados abertos específicos da Saúde?', 'essencial'],
      ['S-P03', 'Possui canal de e-SIC específico ou facilitado para a Saúde?', 'essencial'],
      ['S-P04', 'Possui ferramentas de acessibilidade no portal da Saúde?', 'essencial'],
      ['S-P05', 'Possibilita o agendamento eletrônico de serviços de saúde?', 'essencial'],
      ['S-AG01', 'Divulga informações sobre a estrutura da Secretaria de Saúde?', 'essencial'],
      ['S-AG02', 'Divulga agenda diária do Secretário de Saúde?', 'essencial'],
      ['S-AG03', 'Possui controle interno com atuação específica na Saúde?', 'essencial'],
      ['S-AG04', 'Publica relatórios de auditoria da Saúde?', 'essencial'],
      ['S-AG05', 'Divulga o Plano Municipal de Saúde (PMS/PPA)?', 'essencial'],
      ['S-AG06', 'Divulga a Programação Anual de Saúde (PAS)?', 'essencial'],
      ['S-AG07', 'Divulga o Relatório Anual de Gestão (RAG)?', 'essencial'],
      ['S-AG08', 'Divulga o Código de Ética específico para servidores da Saúde?', 'essencial'],
      ['S-TAD01', 'Publica dados sobre a fila de espera (especialidade, local, posição)?', 'essencial'],
      ['S-TAD02', 'Publica a escala diária de profissionais de saúde nos locais de atendimento?', 'essencial'],
      ['S-TAD03', 'Publica informações sobre o estoque de medicamentos?', 'essencial'],
      ['S-TAD04', 'Divulga convênios e parcerias da Saúde?', 'essencial'],
      ['S-TAD05', 'Divulga contratos com Organizações Sociais (OSs) na Saúde?', 'essencial'],
      ['S-CEP01', 'Possui Conselho Municipal de Saúde ativo?', 'essencial'],
      ['S-CEP02', 'Possui conselhos gestores de unidades de saúde?', 'essencial'],
      ['S-CEP03', 'Possui redes sociais ativas para a Saúde?', 'essencial'],
      ['S-CEP04', 'Possui área de notícias da Saúde atualizada?', 'essencial'],
      ['S-CEP05', 'Oferece participação digital na gestão da Saúde?', 'essencial'],
      ['S-CEP06', 'Realiza e divulga audiências públicas de Saúde?', 'essencial'],
      ['S-CEP07', 'Realiza e divulga Conferências de Saúde?', 'essencial'],
      ['S-CEP08', 'Participação na Saúde (item 08)?', 'essencial'],
      ['S-CEP09', 'Participação na Saúde (item 09)?', 'essencial'],
      ['S-CEP10', 'Participação na Saúde (item 10)?', 'essencial'],
      ['S-CEP11', 'Participação na Saúde (item 11)?', 'essencial'],
    ],
  },
  {
    titulo: '8. Dimensão: Adaptação Climática (Indicadores Específicos)',
    itens: [
      ['C-TG01', 'Possui Plano de Adaptação Climática?', 'essencial'],
      ['C-TG02', 'Possui Plano Diretor com diretrizes climáticas?', 'essencial'],
      ['C-TG03', 'Possui Plano de Habitação com diretrizes climáticas?', 'essencial'],
      ['C-TG04', 'Possui Plano de Saneamento e Resíduos Sólidos?', 'essencial'],
      ['C-TG05', 'Possui Plano de Contingência e metas climáticas no PPA?', 'essencial'],
      ['C-TG06', 'Sistema de alertas de desastres ativo e divulgado?', 'essencial'],
      ['C-TG07', 'Divulga estrutura e contatos da Defesa Civil?', 'essencial'],
      ['C-TG08', 'Divulga estrutura e contatos da Secretaria de Meio Ambiente?', 'essencial'],
      ['C-TG09', 'Transparência em licitações da Defesa Civil?', 'essencial'],
      ['C-TG10', 'Transparência em contratos da Defesa Civil?', 'essencial'],
      ['C-TG11', 'Transparência em licitações de Meio Ambiente?', 'essencial'],
      ['C-TG12', 'Transparência em contratos de Meio Ambiente?', 'essencial'],
      ['C-CP01', 'Possui órgãos colegiados de Mudanças Climáticas?', 'essencial'],
      ['C-CP02', 'Possui órgãos colegiados de Defesa Civil?', 'essencial'],
      ['C-CP03', 'Possui Núcleos Comunitários (Nupdec) ativos?', 'essencial'],
      ['C-CP04', 'Realiza Conferências de Meio Ambiente?', 'essencial'],
      ['C-CP05', 'Possui redes sociais específicas para clima/meio ambiente?', 'essencial'],
      ['C-CP06', 'Participação Climática (item 06)?', 'essencial'],
      ['C-CP07', 'Participação Climática (item 07)?', 'essencial'],
      ['C-CP08', 'Participação Climática (item 08)?', 'essencial'],
      ['C-CP09', 'Participação Climática (item 09)?', 'essencial'],
      ['C-CP10', 'Participação Climática (item 10)?', 'essencial'],
    ],
  },
];

export const itgpDimensoes: DimensaoITGP[] = dimensoesRaw.map((d) => ({
  titulo: d.titulo,
  criterios: d.itens.map(([id, texto, peso]) => ({
    id,
    dimensao: d.titulo,
    texto,
    peso,
  })),
}));

export const todosCriteriosITGP: CriterioITGP[] = itgpDimensoes.flatMap((d) => d.criterios);
