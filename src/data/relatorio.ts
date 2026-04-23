import { todosCriterios } from '@/data/criterios';
import type { Peso } from '@/data/criterios';

export interface RelatorioCriterio {
  id: string;
  dimensao: string;
  texto: string;
  peso: Peso;
  status: 'ok' | 'ausente';
  observacao: string;
  url: string;
  menuPath: string;
}

// Mapping from old analysis IDs → new PNTP 2026 IDs (from transform_report.py)
const oldToNewMapping: Record<string, string> = {
  '1.1': '2.1', '1.2': '2.2', '1.3': '2.4', '1.4': '2.6', '1.6': '2.9',
  '2.1': '3.1', '2.2': '3.2', '2.3': '3.1', '2.4': '5.1', '2.5': '3.2',
  '3.1': '4.2', '3.2': '4.1', '3.3': '4.1', '3.4': '7.1', '3.5': '4.1', '3.6': '11.5',
  '4.1': '8.2', '4.2': '8.1', '4.3': '9.1', '4.4': '8.4', '4.5': '8.6', '4.6': '8.5',
  '5.1': '6.2', '5.2': '6.1', '5.3': '6.6', '5.4': '6.4', '5.5': '6.5',
  '6.1': '5.1', '6.2': '5.2', '6.3': '11.1', '6.4': '17.1',
  '7.1': '10.1', '7.2': '10.1',
  '8.1': '4.2', '8.2': '5.1', '9.1': '4.2', '9.2': '4.2',
  '10.1': '14.1', '10.2': '12.3', '10.3': '14.2', '10.4': '14.3',
  '11.1': '13.1', '11.2': '13.2', '11.3': '13.3', '11.4': '13.4', '11.5': '13.5',
};

// Previous analysis results (from relatorio_pntp.json)
interface OldResult {
  id: string;
  encontrado: boolean;
  url_encontrada: string;
  evidencia: string;
  termo_localizado: string;
  observacao: string;
}

const previousResults: OldResult[] = [
  { id: '1.1', encontrado: false, url_encontrada: '', evidencia: '', termo_localizado: '', observacao: 'Timeout na busca' },
  { id: '1.2', encontrado: false, url_encontrada: '', evidencia: '', termo_localizado: '', observacao: 'Timeout na busca' },
  { id: '1.3', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'horário', observacao: '' },
  { id: '1.4', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'legislação', observacao: '' },
  { id: '1.6', encontrado: true, url_encontrada: 'https://radardatransparencia.atricon.org.br/', evidencia: 'Encontrado via card/banner na página inicial', termo_localizado: 'Radar', observacao: '' },
  { id: '1.7', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: PPA', termo_localizado: 'ppa', observacao: '' },
  { id: '1.8', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: LDO', termo_localizado: 'ldo', observacao: '' },
  { id: '1.9', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: LOA', termo_localizado: 'loa', observacao: '' },
  { id: '2.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Receitas', termo_localizado: 'receita', observacao: '' },
  { id: '2.2', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Receita Corrente', termo_localizado: 'receita corrente', observacao: '' },
  { id: '2.3', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br/#/dinamico/receitas/receitaanalitica', evidencia: 'Série histórica de 2020 a 2026', termo_localizado: 'exercício', observacao: '' },
  { id: '2.4', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Repasses e Transferências', termo_localizado: 'transferências', observacao: '' },
  { id: '2.5', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Despesa Por Fonte de Recurso', termo_localizado: 'fonte de recurso', observacao: '' },
  { id: '3.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Despesas', termo_localizado: 'despesa', observacao: '' },
  { id: '3.2', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Pagamentos', termo_localizado: 'pagamento', observacao: '' },
  { id: '3.6', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Decretos de Execução Orçamentária', termo_localizado: 'execução orçamentária', observacao: '' },
  { id: '4.3', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'contrato', observacao: '' },
  { id: '5.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Pagamentos a Servidores', termo_localizado: 'servidor', observacao: '' },
  { id: '5.3', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'concurso', observacao: '' },
  { id: '6.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'convênio', observacao: '' },
  { id: '6.2', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'repasse', observacao: '' },
  { id: '6.3', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Prestação de Contas', termo_localizado: 'prestação de contas', observacao: '' },
  { id: '6.4', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'emenda', observacao: '' },
  { id: '7.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'obra', observacao: '' },
  { id: '8.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Saúde', termo_localizado: 'saúde', observacao: '' },
  { id: '9.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: FUNDEB', termo_localizado: 'fundeb', observacao: '' },
  { id: '10.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: e-SIC', termo_localizado: 'e-sic', observacao: '' },
  { id: '10.2', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'ouvidoria', observacao: '' },
  { id: '11.1', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: Acessibilidade', termo_localizado: 'acessibilidade', observacao: '' },
  { id: '11.2', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Campo de busca visível', termo_localizado: 'Pesquisar', observacao: '' },
  { id: '11.4', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Encontrado na página inicial', termo_localizado: 'dados abertos', observacao: '' },
  { id: '11.5', encontrado: true, url_encontrada: 'https://transparencia-osasco.smarapd.com.br', evidencia: 'Link: FAQ', termo_localizado: 'faq', observacao: '' },
];

// Build index of old results mapped to new IDs
const mappedResults = new Map<string, OldResult>();
for (const result of previousResults) {
  const newId = oldToNewMapping[result.id];
  if (newId && result.encontrado) {
    mappedResults.set(newId, result);
  }
}

// Special hardcoded overrides for Licitações/Contratos sections
const licitacoesOverrides: Record<string, { url: string; obs: string; menu: string }> = {};
for (const id of ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8']) {
  licitacoesOverrides[id] = {
    url: 'https://transparencia-osasco.smarapd.com.br/#/dinamico/licitacoes_em_andamento/Licitacoes',
    obs: 'Portal disponibiliza repositório de arquivos (editais/anexos) em modal dinâmico.',
    menu: 'Menu: Licitações e Contratos > Licitações',
  };
}
for (const id of ['9.1', '9.2', '9.3', '9.4']) {
  licitacoesOverrides[id] = {
    url: 'https://transparencia-osasco.smarapd.com.br/#/dinamico/compras_contratos_contratos/Contratos',
    obs: 'Contratos listados com detalhes de vigência e valores.',
    menu: 'Menu: Licitações e Contratos > Contratos',
  };
}

// Manual overrides (the initial one from relatorio_pntp_manual.json)
const manualOverrides: Record<string, { status: string; url: string; obs: string }> = {
  '1.1': { status: 'ok', url: '', obs: '' },
};

export function buildRelatorio(): RelatorioCriterio[] {
  return todosCriterios.map((criterio) => {
    const ev = mappedResults.get(criterio.id);
    let status: 'ok' | 'ausente' = ev ? 'ok' : 'ausente';
    let obs = ev?.evidencia || 'Não localizado no portal.';
    let url = ev?.url_encontrada || '';
    let menu = 'Não identificado no portal';

    // Licitações/Contratos override
    if (licitacoesOverrides[criterio.id]) {
      const ov = licitacoesOverrides[criterio.id];
      status = 'ok';
      url = ov.url;
      obs = ov.obs;
      menu = ov.menu;
    }

    // Manual override
    if (manualOverrides[criterio.id]) {
      const m = manualOverrides[criterio.id];
      status = m.status === 'ok' ? 'ok' : 'ausente';
      obs = m.obs || 'Status atualizado manualmente pelo auditor.';
      url = m.url || url;
    }

    return {
      id: criterio.id,
      dimensao: criterio.dimensao,
      texto: criterio.texto,
      peso: criterio.peso,
      status,
      observacao: obs,
      url,
      menuPath: menu,
    };
  });
}
