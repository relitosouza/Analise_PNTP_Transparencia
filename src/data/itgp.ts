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
  peso: 1 | 2;
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
  { id: 'L01', dimensao: '1. Dimensão: Legal', texto: 'Norma de regulamentação da LAI', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L02', dimensao: '1. Dimensão: Legal', texto: 'Norma sobre Dados Abertos ou PDA', peso: 1, guia: '0 - Não; 0,5 - Sim, possui norma ou PDA; 1 - Sim, possui norma e PDA.', opcoes: OPCOES_0_05_1 },
  { id: 'L03', dimensao: '1. Dimensão: Legal', texto: 'Regulamentação de conflitos de interesses', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L04', dimensao: '1. Dimensão: Legal', texto: 'Norma de proteção ao denunciante', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'L05', dimensao: '1. Dimensão: Legal', texto: 'Regulamentação e adequação à LGPD', peso: 2, guia: '0 - Não; 0,5 - Regulamentou, mas não adequou; 1 - Sim (regulamentou e adequou).', opcoes: OPCOES_0_05_1 },
  { id: 'L06', dimensao: '1. Dimensão: Legal', texto: 'Regulamentação da Lei Anticorrupção', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 2. Dimensão: Plataformas
  { id: 'P01', dimensao: '2. Dimensão: Plataformas', texto: 'Portal de Transparência', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P02', dimensao: '2. Dimensão: Plataformas', texto: 'Portal de Dados Abertos', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P03', dimensao: '2. Dimensão: Plataformas', texto: 'e-SIC', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P04', dimensao: '2. Dimensão: Plataformas', texto: 'Ouvidoria', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'P05', dimensao: '2. Dimensão: Plataformas', texto: 'Canal de denúncias de corrupção anônimas', peso: 2, guia: '0 - Não; 0,5 - Sim, apenas canal geral; 1 - Sim, com campo específico para corrupção.', opcoes: OPCOES_0_05_1 },
  { id: 'P06', dimensao: '2. Dimensão: Plataformas', texto: 'Diário Oficial online', peso: 2, guia: '0 - Não; 0,5 - Sim, mas não em formato aberto; 1 - Sim, em formato aberto.', opcoes: OPCOES_0_05_1 },
  { id: 'P07', dimensao: '2. Dimensão: Plataformas', texto: 'Requisitos do e-SIC (4 requisitos)', peso: 2, guia: '0 - Não; 0,25 a 1 ponto (proporcional ao número de requisitos cumpridos).', opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'P08', dimensao: '2. Dimensão: Plataformas', texto: 'Relatórios de e-SIC', peso: 2, guia: '0 - Não existe; 0,5 - Existente e desatualizado; 1 - Existente e atualizado.', opcoes: OPCOES_0_05_1 },
  { id: 'P09', dimensao: '2. Dimensão: Plataformas', texto: 'Relatórios de Ouvidoria', peso: 2, guia: '0 - Não existe; 0,5 - Existente e desatualizado; 1 - Existente e atualizado.', opcoes: OPCOES_0_05_1 },
  { id: 'P10', dimensao: '2. Dimensão: Plataformas', texto: 'Ferramentas de acessibilidade (4 requisitos)', peso: 1, guia: '0 - Não; 0,25 a 1 ponto (conforme o número de itens atendidos).', opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'P11', dimensao: '2. Dimensão: Plataformas', texto: 'Visualização de dados (dashboards)', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 3. Dimensão: Governança e Administrativo
  { id: 'AG01', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Estrutura e contatos', peso: 2, guia: '0 - Não; 0,5 - Até 2 requisitos; 1 - Todos os requisitos.', opcoes: OPCOES_0_05_1 },
  { id: 'AG02', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Agenda do chefe do executivo', peso: 2, guia: '0 - Não; 0,5 - Sim, mas a posteriori; 1 - Sim, antecipada.', opcoes: OPCOES_0_05_1 },
  { id: 'AG03', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Órgão de Controle Interno (OCI) criado por norma', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG04', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Escalão do OCI', peso: 2, guia: '0 - Abaixo do 2º escalão; 0,5 - 2º escalão; 1 - 1º escalão.', opcoes: OPCOES_0_05_1 },
  { id: 'AG05', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Servidores efetivos no OCI', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG07', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Relatórios de auditoria interna', peso: 2, guia: '0 - Não; 0,5 - Desatualizado; 1 - Atualizado.', opcoes: OPCOES_0_05_1 },
  { id: 'AG08', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'OCI Externo (Audit. Externa)', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG09', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'PPA (Plano Plurianual)', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'AG10', dimensao: '3. Dimensão: Governança e Administrativo', texto: 'Código de Ética', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 4. Dimensão: Obras Públicas
  { id: 'OBR01', dimensao: '4. Dimensão: Obras Públicas', texto: 'Acompanhamento financeiro de obras', peso: 2, guia: '0 - Não; 0,5 - Até 2 requisitos; 1 - 3 requisitos.', opcoes: OPCOES_0_05_1 },
  { id: 'OBR02', dimensao: '4. Dimensão: Obras Públicas', texto: 'Acompanhamento técnico/físico (7 requisitos)', peso: 2, guia: '0 - Não; 0,25 a 1 ponto (proporcional aos requisitos).', opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'OBR03', dimensao: '4. Dimensão: Obras Públicas', texto: 'Plano de Contratações', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR04', dimensao: '4. Dimensão: Obras Públicas', texto: 'Informações sobre fiscais', peso: 1, guia: '0 - Não; 0,5 - 1 requisito; 1 - 2 requisitos.', opcoes: OPCOES_0_05_1 },
  { id: 'OBR05', dimensao: '4. Dimensão: Obras Públicas', texto: 'EIA/RIMA', peso: 2, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'OBR06', dimensao: '4. Dimensão: Obras Públicas', texto: 'Licenças ambientais (8 requisitos)', peso: 2, guia: '0 - Não; 0,25 a 1 ponto (conforme o número de itens).', opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'OBR07', dimensao: '4. Dimensão: Obras Públicas', texto: 'Audiências Públicas', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 5. Dimensão: Transparência Financeira e Orçamentária
  { id: 'TF001', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Salários e Remuneração', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF002', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Receitas Detalhadas', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF003', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Despesas Detalhadas', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF004', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Convênios e Parcerias', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF005', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Diárias e Passagens', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF006', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Obras Públicas', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF007', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Patrimônio e Bens Móveis', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF008', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Detalhamento de despesas (6 itens)', peso: 2, guia: '0 - Não; 0,25 a 1 ponto.', opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF009', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Veículos Oficiais', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF010', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Almoxarifado e Estoques', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF011', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Renúncias de Receita', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF012', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Concursos e Seletivos', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF013', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Detalhes de licitações (12 itens)', peso: 2, guia: '0 - Não; 0,25 a 1 ponto.', opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF014', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Estagiários e Terceirizados', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF015', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Detalhes de contratos (10 itens)', peso: 2, guia: '0 - Não; 0,25 a 1 ponto.', opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF016', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Dívida Pública', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF019', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Patrimônio Imobiliário', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF020', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Base: Fornecedores Penalizados', peso: 2, guia: GUIA_ABERTO, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF021', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Emendas Parlamentares Recebidas', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF022', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Transferências Especiais (Pix)', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF023', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Execução de Emendas', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'TF025', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Relatório Resumido de Execução Orçamentária (RREO)', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF026', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Relatório de Gestão Fiscal (RGF)', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'TF027', dimensao: '5. Dimensão: Transparência Financeira e Orçamentária', texto: 'Prestação de Contas Anual', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 6. Dimensão: Comunicação e Participação
  { id: 'CEP01', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Conselhos de Políticas Públicas (5 requisitos)', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'CEP02', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Conselho da Cidade / Plano Diretor', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP03', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Conselho de Educação', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP04', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Conselho de Assistência Social', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP05', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Conselho de Meio Ambiente', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP06', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Orçamento Participativo', peso: 2, guia: '0 - Não; 0,5 - Apenas presencial; 1 - Com participação digital/remota.', opcoes: OPCOES_0_05_1 },
  { id: 'CEP07', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Consultas Públicas (transmissão e resultados)', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'CEP08', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Audiências Públicas (transmissão e resultados)', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'CEP09', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Redes Sociais Oficiais Ativas', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },
  { id: 'CEP10', dimensao: '6. Dimensão: Comunicação e Participação', texto: 'Serviço de Atendimento ao Cidadão (SAC)', peso: 1, guia: '0 - Não; 1 - Sim.', opcoes: OPCOES_0_1 },

  // 7. Saúde e Adaptação Climática
  { id: 'S-CEP', dimensao: '7. Saúde e Adaptação Climática', texto: 'Conselho Municipal de Saúde (Atas/Membros)', peso: 2, guia: '0 a 1 ponto conforme a presença de atas, membros e calendários.', opcoes: OPCOES_0_05_1 },
  { id: 'S-AG05', dimensao: '7. Saúde e Adaptação Climática', texto: 'Plano Municipal de Saúde', peso: 1, guia: '0 - Não; 0,5 - Desatualizado; 1 - Atualizado/Permite download.', opcoes: OPCOES_0_05_1 },
  { id: 'S-TAD01', dimensao: '7. Saúde e Adaptação Climática', texto: 'Dados de Fila de Espera (Especialidade/Local)', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'S-TAD02', dimensao: '7. Saúde e Adaptação Climática', texto: 'Escala de Profissionais (CRM/Horários)', peso: 2, guia: GUIA_PROPORCIONAL, opcoes: OPCOES_PROPORCIONAL_4 },
  { id: 'C-CP', dimensao: '7. Saúde e Adaptação Climática', texto: 'Conselho de Meio Ambiente/Clima', peso: 1, guia: '0 a 1 ponto conforme a presença de atas, membros e calendários.', opcoes: OPCOES_0_05_1 },
  { id: 'C-TG01', dimensao: '7. Saúde e Adaptação Climática', texto: 'Plano de Adaptação Climática / Contingência', peso: 1, guia: '0 - Não; 0,5 - Desatualizado; 1 - Atualizado/Permite download.', opcoes: OPCOES_0_05_1 },
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
