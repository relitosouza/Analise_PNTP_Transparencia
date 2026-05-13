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
    titulo: '1. Dimensão: Legal',
    itens: [
      ['L01', 'Norma de regulamentação da LAI?', 'essencial'],
      ['L02', 'Norma sobre dados abertos ou PDA?', 'essencial'],
      ['L03', 'Regulamentação de conflitos de interesses?', 'essencial'],
      ['L04', 'Norma de proteção ao denunciante?', 'essencial'],
      ['L05', 'Regulamentação da LGPD e adequação?', 'essencial'],
      ['L06', 'Regulamentação da Lei Anticorrupção?', 'essencial'],
    ],
  },
  {
    titulo: '2. Dimensão: Plataformas',
    itens: [
      ['P01', 'Portal da Transparência em destaque?', 'essencial'],
      ['P02', 'Portal de Dados Abertos em destaque?', 'obrigatorio'],
      ['P03', 'Canal de acesso à informação (e-SIC)?', 'essencial'],
      ['P04', 'Canal de ouvidoria em destaque?', 'essencial'],
      ['P05', 'Canal para denúncias de corrupção?', 'essencial'],
      ['P06', 'Diário Oficial online em formato aberto?', 'essencial'],
      ['P07', 'Requisitos do e-SIC (protocolo/identidade)?', 'essencial'],
      ['P08', 'Relatórios de acesso à informação?', 'essencial'],
      ['P09', 'Relatórios de ouvidoria?', 'essencial'],
      ['P10', 'Ferramentas de acessibilidade?', 'obrigatorio'],
      ['P11', 'Visualizações de dados (dashboards)?', 'recomendado'],
    ],
  },
  {
    titulo: '3. Dimensão: Governança e Administrativo',
    itens: [
      ['AG01', 'Estrutura (organograma e contatos)?', 'essencial'],
      ['AG02', 'Agenda do chefe do executivo?', 'essencial'],
      ['AG03', 'Órgão de Controle Interno?', 'essencial'],
      ['AG04', 'Nível hierárquico do Controle Interno?', 'essencial'],
      ['AG05', 'Servidores efetivos no Controle Interno?', 'essencial'],
      ['AG06', 'Planejamento anual de auditorias?', 'essencial'],
      ['AG07', 'Relatórios de auditoria interna?', 'essencial'],
      ['AG08', 'Relatórios de controle externo?', 'obrigatorio'],
      ['AG09', 'Cumprimento das metas do PPA?', 'essencial'],
      ['AG10', 'Código de Ética ou Conduta?', 'obrigatorio'],
    ],
  },
  {
    titulo: '4. Dimensão: Obras Públicas',
    itens: [
      ['OBR01', 'Acompanhamento financeiro de obras?', 'obrigatorio'],
      ['OBR02', 'Acompanhamento técnico e físico?', 'essencial'],
      ['OBR03', 'Plano de Contratações Anual?', 'obrigatorio'],
      ['OBR04', 'Informações sobre fiscais?', 'obrigatorio'],
      ['OBR05', 'Estudos de impacto (EIA/RIMA)?', 'essencial'],
      ['OBR06', 'Licenças ambientais?', 'obrigatorio'],
      ['OBR07', 'Audiências para editais de obras?', 'obrigatorio'],
    ],
  },
  {
    titulo: '5. Dimensão: Transparência Financeira',
    itens: [
      ['TF001', 'Base Aberta: Salários Nominais', 'essencial'],
      ['TF005', 'Base Aberta: Receitas', 'essencial'],
      ['TF007', 'Base Aberta: Despesas', 'essencial'],
      ['TF012', 'Base Aberta: Licitações', 'essencial'],
      ['TF014', 'Base Aberta: Contratos', 'essencial'],
      ['TF020', 'Base Aberta: Emendas Municipais', 'obrigatorio'],
      ['TF025', 'Relatório RREO', 'essencial'],
      ['TF026', 'Relatório RGF', 'essencial'],
    ],
  },
  {
    titulo: '7. Dimensão: Saúde',
    itens: [
      ['S-P01', 'Saúde: Destaque ao portal', 'essencial'],
      ['S-AG05', 'Saúde: Plano Municipal de Saúde', 'essencial'],
      ['S-TAD01', 'Saúde: Fila de espera', 'essencial'],
      ['S-TAD02', 'Saúde: Escala de profissionais', 'essencial'],
      ['S-CEP01', 'Saúde: Conselho de Saúde ativo', 'essencial'],
    ],
  },
  {
    titulo: '8. Dimensão: Adaptação Climática',
    itens: [
      ['C-TG01', 'Clima: Plano de Adaptação', 'essencial'],
      ['C-TG05', 'Clima: Alertas de desastres', 'essencial'],
      ['C-TG06', 'Clima: Estrutura Defesa Civil', 'essencial'],
      ['C-CP01', 'Clima: Órgãos colegiados', 'obrigatorio'],
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
