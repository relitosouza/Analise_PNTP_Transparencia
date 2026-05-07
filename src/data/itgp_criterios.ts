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
      ['L01', 'Regulamentação da LAI municipal?', 'essencial'],
      ['L02', 'Norma sobre Dados Abertos ou Plano de Dados Abertos (PDA)?', 'essencial'],
      ['L03', 'Regulamentação de conflitos de interesses?', 'essencial'],
      ['L04', 'Norma de proteção ao denunciante?', 'essencial'],
      ['L05', 'Regulamentação e adequação à LGPD?', 'essencial'],
      ['L06', 'Regulamentação da Lei Anticorrupção?', 'essencial'],
    ],
  },
  {
    titulo: '2. Plataformas e Transparência Digital',
    itens: [
      ['P01', 'Portais (Transparência, Dados Abertos, e-SIC, Ouvidoria) em destaque?', 'essencial'],
      ['P05', 'Canal para denúncias de corrupção anônimas?', 'essencial'],
      ['P06', 'Diário Oficial online em formato aberto?', 'essencial'],
      ['P07', 'Requisitos do e-SIC (protocolo, tramitação, recurso, proteção de identidade)?', 'essencial'],
      ['P08', 'Relatórios estatísticos do e-SIC trimestrais?', 'essencial'],
      ['P09', 'Relatórios estatísticos da Ouvidoria trimestrais?', 'essencial'],
      ['P10', 'Ferramentas de acessibilidade digital (Libras, audiodescrição, etc)?', 'essencial'],
    ],
  },
  {
    titulo: '3. Governança Administrativa',
    itens: [
      ['AG01', 'Estrutura (organograma, funções, contatos)?', 'essencial'],
      ['AG02', 'Agenda da chefia do executivo diária?', 'essencial'],
      ['AG04', 'Nível hierárquico do Controle Interno?', 'essencial'],
      ['AG07', 'Relatório de auditoria Interna atualizado?', 'essencial'],
      ['AG08', 'Relatório de auditoria Externa atualizado?', 'essencial'],
    ],
  },
  {
    titulo: '4. Obras Públicas',
    itens: [
      ['OBR01', 'Dados financeiros das obras (empenho, pagamento, medição)?', 'essencial'],
      ['OBR02', 'Dados técnicos das obras (local, fotos, prazos, fiscais)?', 'essencial'],
      ['OBR06', 'Informações sobre licenças ambientais?', 'essencial'],
    ],
  },
  {
    titulo: '5. Transparência Financeira (Bases de Dados Abertas)',
    itens: [
      ['TF01', 'Base de dados: Salários (Acesso gratuito, Legível por máquina, Download, Série histórica)?', 'essencial'],
      ['TF02', 'Base de dados: Receitas (Acesso gratuito, Legível por máquina, Download, Série histórica)?', 'essencial'],
      ['TF03', 'Base de dados: Despesas (Acesso gratuito, Legível por máquina, Download, Série histórica)?', 'essencial'],
      ['TF04', 'Base de dados: Licitações (Acesso gratuito, Legível por máquina, Download, Série histórica)?', 'essencial'],
      ['TF05', 'Base de dados: Contratos (Acesso gratuito, Legível por máquina, Download, Série histórica)?', 'essencial'],
    ],
  },
  {
    titulo: '6. Saúde',
    itens: [
      ['S-TAD01', 'Dados sobre fila de espera (especialidade, local, idade, etc)?', 'essencial'],
      ['S-TAD02', 'Escala diária de profissionais de saúde (nome, CRM, horário, local, etc)?', 'essencial'],
      ['S-AG05', 'Plano Municipal de Saúde (PMS)?', 'essencial'],
      ['S-AG06', 'Programação Anual de Saúde (PAS)?', 'essencial'],
      ['S-AG07', 'Relatório Anual de Gestão (RAG)?', 'essencial'],
    ],
  },
  {
    titulo: '7. Adaptação Climática',
    itens: [
      ['C-TG02', 'Planos municipais (Diretor, Habitação, Saneamento, Resíduos)?', 'essencial'],
      ['C-TG08', 'Estrutura da Defesa Civil (organograma, funções, contatos)?', 'essencial'],
      ['C-TG11', 'Estrutura do Meio Ambiente (organograma, funções, contatos)?', 'essencial'],
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
