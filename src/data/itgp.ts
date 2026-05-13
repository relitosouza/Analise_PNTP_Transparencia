export type ITGPStatus = number | 'nao_avaliado';

export interface ITGPOpcao {
  label: string;
  valor: number;
}

export interface ITGPPergunta {
  id: string;
  dimensao: string;
  subdimensao?: string;
  texto: string;
  peso: number;
  guia: string;
  opcoes: ITGPOpcao[];
}

export interface ITGPResposta {
  status: ITGPStatus;
  observacao: string;
  url: string;
}

const OPCOES_0_1: ITGPOpcao[] = [
  { label: 'Não (0)', valor: 0 },
  { label: 'Sim (1)', valor: 1 },
];

const OPCOES_0_05_1: ITGPOpcao[] = [
  { label: 'Não (0)', valor: 0 },
  { label: 'Parcial (0.5)', valor: 0.5 },
  { label: 'Sim (1)', valor: 1 },
];

const OPCOES_PROPORCIONAL_4: ITGPOpcao[] = [
  { label: 'Não (0)', valor: 0 },
  { label: '1 req. (0.25)', valor: 0.25 },
  { label: '2 req. (0.5)', valor: 0.5 },
  { label: '3 req. (0.75)', valor: 0.75 },
  { label: '4 req. (1)', valor: 1 },
];

const OPCOES_PROPORCIONAL_3: ITGPOpcao[] = [
  { label: 'Não (0)', valor: 0 },
  { label: '1 req. (0.33)', valor: 0.33 },
  { label: '2 req. (0.66)', valor: 0.66 },
  { label: '3 req. (1)', valor: 1 },
];

const GUIA_ABERTO = "Requisitos: 1. Gratuito/Licença Aberta | 2. Legível por máquina | 3. Download disponível | 4. Série histórica.";
const GUIA_PROPORCIONAL = "0 - Não | 0,25 a 0,75 - Proporcional aos requisitos atendidos | 1 - Pleno.";

export const itgpPerguntas: ITGPPergunta[] = [
  // 1. Dimensão: Legal
  { id: 'L01', dimensao: '1. Dimensão: Legal', texto: 'Possui norma de regulamentação da Lei nº 12.527/2011 (LAI)?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L02', dimensao: '1. Dimensão: Legal', texto: 'Possui norma sobre dados abertos ou Plano de Dados Abertos (PDA) em vigência?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L03', dimensao: '1. Dimensão: Legal', texto: 'Possui regulamentação de conflitos de interesses?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L04', dimensao: '1. Dimensão: Legal', texto: 'Possui norma de proteção ao denunciante?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L05', dimensao: '1. Dimensão: Legal', texto: 'Possui regulamentação da LGPD (Lei nº 13.709/2018) e concluiu o processo de adequação?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L06', dimensao: '1. Dimensão: Legal', texto: 'Possui regulamentação municipal da Lei Anticorrupção (Lei nº 12.846/2013)?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 2. Dimensão: Plataformas
  { id: 'P01', dimensao: '2. Dimensão: Plataformas', texto: 'Possui Portal da Transparência em destaque no portal principal?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P02', dimensao: '2. Dimensão: Plataformas', texto: 'Possui Portal de Dados Abertos em destaque no portal principal?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P03', dimensao: '2. Dimensão: Plataformas', texto: 'Possui canal de acesso à informação em destaque no site principal?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P04', dimensao: '2. Dimensão: Plataformas', texto: 'Possui canal de ouvidoria em destaque no site principal?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P05', dimensao: '2. Dimensão: Plataformas', texto: 'Possui canal para denúncias de corrupção anônimas em destaque no site principal?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P06', dimensao: '2. Dimensão: Plataformas', texto: 'Possui Diário Oficial online em destaque (e em formato aberto)?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P07', dimensao: '2. Dimensão: Plataformas', texto: 'O serviço eletrônico de acesso à informação permite acompanhamento, protocolo, recursos e protege a identidade do requerente?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P08', dimensao: '2. Dimensão: Plataformas', texto: 'Publica relatórios estatísticos de acesso à informação atualizados trimestralmente?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P09', dimensao: '2. Dimensão: Plataformas', texto: 'Publica relatórios estatísticos de ouvidoria atualizados trimestralmente?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P10', dimensao: '2. Dimensão: Plataformas', texto: 'Disponibiliza ferramentas de acessibilidade (símbolo, Libras, contraste, leitores de tela)?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P11', dimensao: '2. Dimensão: Plataformas', texto: 'Promove visualizações de dados (dashboards, gráficos) nos portais?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 3. Dimensão: Governança e Administrativo
  { id: 'AG01', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Divulga informações sobre estrutura (organograma, funções e contatos)?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG02', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Divulga agenda diária do chefe do executivo de forma antecipada?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG03', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Possui órgão de controle interno com atribuições de transparência, auditoria e combate à corrupção?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG04', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'O órgão de controle interno está no primeiro ou segundo escalão do governo?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG05', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'O órgão de controle interno possui servidores efetivos?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG06', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Realiza planejamento anual de auditorias?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG07', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Publica pareceres ou relatórios de auditoria interna anualmente?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG08', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Publica pareceres ou relatórios de órgãos de controle externo (Tribunal de Contas/MP)?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG09', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Divulga anualmente o cumprimento das metas do Plano Plurianual (PPA)?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG10', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Divulga o Código de Ética ou Conduta dos servidores em destaque?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 4. Dimensão: Obras Públicas
  { id: 'OBR01', dimensao: '4. Dimensão: Obras Públicas', texto: 'Possui plataforma para acompanhamento financeiro de obras (empenhos, medições)?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR02', dimensao: '4. Dimensão: Obras Públicas', texto: 'A plataforma inclui localização, imagens, contatos, prazos, atrasos e execução física?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR03', dimensao: '4. Dimensão: Obras Públicas', texto: 'Publica o Plano de Contratações Anual de forma centralizada?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR04', dimensao: '4. Dimensão: Obras Públicas', texto: 'Publica informações sobre os fiscais dos contratos (nome, registro/CPF)?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR05', dimensao: '4. Dimensão: Obras Públicas', texto: 'Publica estudos de impacto (EIA/RIMA ou EIV) das obras?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR06', dimensao: '4. Dimensão: Obras Públicas', texto: 'Publica informações centralizadas sobre licenças ambientais emitidas?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR07', dimensao: '4. Dimensão: Obras Públicas', texto: 'Publica informações sobre audiências ou consultas públicas para editais de obras?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 5. Dimensão: Transparência Financeira e Orçamentária
  { id: 'TF001', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Salários Nominais (com download e série histórica)', peso: 4, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF002', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Verbas Indenizatórias (com download e série histórica)', peso: 4, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF003', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Benefícios por Terceiros (com download e série histórica)', peso: 4, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF004', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Doações Recebidas (com download e série histórica)', peso: 4, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF005', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Receitas (com download e série histórica)', peso: 4, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF006', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Receitas por Unidade Gestora (com download e série histórica)', peso: 4, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF007', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Despesas (com download e série histórica)', peso: 4, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF008', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Detalhamento de despesas por unidade, categoria, grupo, função e empenho', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF009', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Incentivos Fiscais', peso: 3, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF010', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Transferências Obrigatórias', peso: 3, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF011', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Transferências Voluntárias', peso: 3, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF012', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Licitações', peso: 3, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF013', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Divulga detalhes das licitações (modalidade, valor, empresas participantes, vencedora)', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF014', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Contratos (vigência, valores, íntegra)', peso: 1, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF015', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Aditivos (vigência, valores, íntegra)', peso: 1, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF016', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Contratos Emergenciais (datas, objeto)', peso: 1, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF017', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Contratos Emergenciais (valores)', peso: 1, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF018', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Divulga informações sobre parcerias com o MROSC', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF019', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Publica base de dados sobre patrimônio público (bens imóveis)', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF020', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Emendas Parlamentares Municipais', peso: 1, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF021', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Detalhamento de repasses e estágios das emendas municipais', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF022', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base Aberta: Emendas Estaduais/Federais', peso: 1, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF023', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Transferências especiais ("emendas pix")', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF024', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Utiliza sistema de compras eletrônicas com registro de preços, cadastro e manuais', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF025', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Divulga Relatório Resumido de Execução Orçamentária (RREO)', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF026', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Divulga Relatório de Gestão Fiscal (RGF)', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF027', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Divulga relatórios da dívida pública', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 6. Dimensão: Comunicação, Engajamento e Participação
  { id: 'CEP01', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Possui página centralizada com informações sobre conselhos de políticas públicas ativos?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP02', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Possui Conselho de Transparência ou Combate à Corrupção ativo?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP03', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Publica sistema de gerenciamento eletrônico de documentos e processos públicos?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP04', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Possui redes sociais ativas?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP05', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Possui área de notícias no portal atualizada?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP06', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Oferece oportunidades de participação na discussão do orçamento anualmente?', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP07', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Publica informações sobre consultas públicas realizadas no último ano', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP08', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Publica informações sobre audiências públicas realizadas no último ano', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP09', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Divulga Carta de Serviços aos Cidadãos atualizada semestralmente?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP10', dimensao: '6. Dimensão: Comunicação, Engajamento e Participação', texto: 'Possibilita o agendamento ou prestação digital de serviços públicos?', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 7. Dimensão: Saúde (Indicadores Específicos)
  { id: 'S-P01', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Destaque ao portal no site principal', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-P02', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Dados abertos disponíveis', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-P03', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: e-SIC específico ou integrado', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-P04', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Ferramentas de acessibilidade', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-P05', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Agendamento eletrônico de serviços', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-AG01', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Estrutura (organograma e contatos)', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-AG02', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Agenda do secretário', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-AG03', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Controle interno atuante', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-AG04', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Relatórios de auditoria', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-AG05', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Plano Municipal de Saúde (PPA/PAS/RAG)', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-AG06', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Código de ética específico', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-TAD01', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Fila de espera detalhada', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-TAD02', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Escala de profissionais diária', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-TAD03', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Estoque de medicamentos', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-TAD04', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Convênios e contratos com OSs', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-CEP01', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Conselho Municipal de Saúde ativo', peso: 3, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-CEP02', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Conselhos gestores de unidades', peso: 3, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-CEP03', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Redes sociais e notícias atualizadas', peso: 3, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-CEP04', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Participação digital e audiências', peso: 3, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'S-CEP05', dimensao: '7. Dimensão: Saúde', texto: 'Saúde: Conferências de Saúde realizadas', peso: 3, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 8. Dimensão: Adaptação Climática (Indicadores Específicos)
  { id: 'C-TG01', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Plano de Adaptação Climática', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-TG02', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Planos Diretor/Habitação/Saneamento/Resíduos', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-TG03', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Plano de Contingência', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-TG04', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Metas climáticas no PPA', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-TG05', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Alertas de desastres', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-TG06', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Estrutura da Defesa Civil e Meio Ambiente', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-TG07', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Transparência em licitações/contratos específicos', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-CP01', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Órgãos colegiados de Mudanças Climáticas', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-CP02', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Núcleos Comunitários (Nupdec)', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-CP03', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Conferência de Meio Ambiente', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'C-CP04', dimensao: '8. Dimensão: Adaptação Climática', texto: 'Clima: Redes sociais específicas', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
];

export const ITGP_STORAGE_KEY = 'itgp_respostas_v2025';

export function getClassificacaoITGP(percentual: number): { label: string; color: string } {
  if (percentual >= 80) return { label: 'Ótimo', color: 'text-emerald-600' };
  if (percentual >= 60) return { label: 'Bom', color: 'text-blue-600' };
  if (percentual >= 40) return { label: 'Regular', color: 'text-amber-600' };
  if (percentual >= 20) return { label: 'Ruim', color: 'text-orange-600' };
  return { label: 'Péssimo', color: 'text-red-600' };
}

export function calcularPontuacaoITGP(respostas: Record<string, ITGPResposta>): {
  pontuacao: number;
  pontuacaoMaxima: number;
  percentual: number;
  porDimensao: Record<string, { pontuacao: number; pontuacaoMaxima: number; percentual: number; totalPerguntas: number }>;
} {
  let pontuacao = 0;
  let pontuacaoMaxima = 0;
  const porDimensao: Record<string, { pontuacao: number; pontuacaoMaxima: number; percentual: number; totalPerguntas: number }> = {};

  for (const p of itgpPerguntas) {
    const max = p.peso; 
    pontuacaoMaxima += max;

    if (!porDimensao[p.dimensao]) {
      porDimensao[p.dimensao] = { pontuacao: 0, pontuacaoMaxima: 0, percentual: 0, totalPerguntas: 0 };
    }
    porDimensao[p.dimensao].pontuacaoMaxima += max;
    porDimensao[p.dimensao].totalPerguntas += 1;

    const r = respostas[p.id];
    let valor = 0;
    if (r && typeof r.status === 'number') {
      valor = r.status * p.peso;
    }

    pontuacao += valor;
    porDimensao[p.dimensao].pontuacao += valor;
  }

  for (const dim of Object.keys(porDimensao)) {
    const d = porDimensao[dim];
    d.percentual = d.pontuacaoMaxima > 0 ? Math.round((d.pontuacao / d.pontuacaoMaxima) * 100) : 0;
  }

  return {
    pontuacao,
    pontuacaoMaxima,
    percentual: pontuacaoMaxima > 0 ? Math.round((pontuacao / pontuacaoMaxima) * 100) : 0,
    porDimensao,
  };
}
