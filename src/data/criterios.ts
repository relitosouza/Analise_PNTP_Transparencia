export type Peso = 'essencial' | 'obrigatorio' | 'recomendado';

export interface Criterio {
  id: string;
  dimensao: string;
  texto: string;
  peso: Peso;
}

export interface Dimensao {
  titulo: string;
  criterios: Criterio[];
}

const dimensoesRaw: { titulo: string; itens: [string, string, Peso][] }[] = [
  {
    titulo: '1. Informações Prioritárias',
    itens: [
      ['1.1', 'Possui sítio oficial próprio na internet?', 'essencial'],
      ['1.2', 'Possui portal da transparência próprio ou compartilhado na internet?', 'essencial'],
      ['1.3', 'O acesso ao portal transparência está visível na capa do site?', 'essencial'],
      ['1.4', 'O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo que permita o acesso à informação?', 'obrigatorio'],
    ],
  },
  {
    titulo: '2. Informações Institucionais',
    itens: [
      ['2.1', 'Divulga a sua estrutura organizacional e a norma que a institui/altera?', 'essencial'],
      ['2.2', 'Divulga competências e/ou atribuições?', 'essencial'],
      ['2.3', 'Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?', 'obrigatorio'],
      ['2.4', 'Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?', 'essencial'],
      ['2.5', 'Divulga o horário de atendimento?', 'essencial'],
      ['2.6', 'Divulga os atos normativos próprios?', 'obrigatorio'],
      ['2.7', 'Divulga as perguntas e respostas mais frequentes relacionadas às atividades desenvolvidas pelo Poder/Órgão?', 'recomendado'],
      ['2.8', 'Participa em redes sociais e apresenta, no seu sítio institucional, link de acesso ao seu perfil?', 'recomendado'],
      ['2.9', 'Inclui botão do Radar da Transparência Pública no site institucional ou portal transparência?', 'obrigatorio'],
    ],
  },
  {
    titulo: '3. Receita',
    itens: [
      ['3.1', 'Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?', 'essencial'],
      ['3.2', 'Divulga a classificação orçamentária por natureza da receita (categoria econômica, origem, espécie, desdobramento)?', 'essencial'],
      ['3.3', 'Divulga a lista dos inscritos em dívida ativa, contendo, no mínimo, dados referentes ao nome do inscrito e o valor total da dívida?', 'obrigatorio'],
    ],
  },
  {
    titulo: '4. Despesa',
    itens: [
      ['4.1', 'Divulga o total das despesas empenhadas, liquidadas e pagas?', 'essencial'],
      ['4.2', 'Divulga as despesas por classificação orçamentária?', 'essencial'],
      ['4.3', 'Possibilita a consulta de empenhos com os detalhes do beneficiário do pagamento ou credor, o valor, o bem fornecido ou serviço prestado e a identificação do procedimento licitatório originário da despesa?', 'essencial'],
      ['4.4', 'Publica relação das despesas com aquisições de bens efetuadas pela instituição contendo: identificação do bem, preço unitário, quantidade, nome do fornecedor e valor total de cada aquisição?', 'obrigatorio'],
      ['4.5', 'Publica informações sobre despesas de patrocínio?', 'recomendado'],
      ['4.6', 'Publica informações detalhadas sobre a execução dos contratos de publicidade?', 'recomendado'],
    ],
  },
  {
    titulo: '5. Convênios e Transferências',
    itens: [
      ['5.1', 'Divulga as transferências recebidas a partir da celebração de convênios/acordos?', 'essencial'],
      ['5.2', 'Divulga as transferências realizadas a partir da celebração de convênios/acordos/ajustes?', 'essencial'],
      ['5.3', 'Divulga os acordos firmados que não envolvam transferência de recursos financeiros?', 'obrigatorio'],
    ],
  },
  {
    titulo: '6. Recursos Humanos',
    itens: [
      ['6.1', 'Divulga a relação nominal dos servidores/autoridades/membros, seus cargos/funções, lotações e datas de admissão/exoneração?', 'essencial'],
      ['6.2', 'Divulga a remuneração nominal de cada servidor/autoridade/Membro?', 'essencial'],
      ['6.3', 'Divulga a tabela com o padrão remuneratório dos cargos e funções?', 'obrigatorio'],
      ['6.4', 'Divulga a lista de seus estagiários?', 'recomendado'],
      ['6.5', 'Publica lista dos terceirizados?', 'obrigatorio'],
      ['6.6', 'Divulga a íntegra dos editais de concursos e seleções públicas?', 'obrigatorio'],
      ['6.7', 'Divulga informações sobre os demais atos dos concursos públicos?', 'obrigatorio'],
    ],
  },
  {
    titulo: '7. Diárias',
    itens: [
      ['7.1', 'Divulga o nome e o cargo/função do beneficiário, valor total, período e motivo?', 'essencial'],
      ['7.2', 'Divulga tabela ou relação que explicite os valores das diárias?', 'obrigatorio'],
    ],
  },
  {
    titulo: '8. Licitações',
    itens: [
      ['8.1', 'Divulga a relação das licitações em ordem sequencial?', 'essencial'],
      ['8.2', 'Divulga a íntegra dos editais de licitação?', 'essencial'],
      ['8.3', 'Divulga a íntegra dos demais documentos das fases interna e externa?', 'obrigatorio'],
      ['8.4', 'Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade?', 'essencial'],
      ['8.5', 'Divulga a íntegra das Atas de Adesão – SRP?', 'obrigatorio'],
      ['8.6', 'Divulga o plano de contratações anual?', 'obrigatorio'],
      ['8.7', 'Divulga a relação dos licitantes e/ou contratados sancionados administrativamente?', 'obrigatorio'],
      ['8.8', 'Divulga regulamento interno de licitações e contratos?', 'recomendado'],
    ],
  },
  {
    titulo: '9. Contratos',
    itens: [
      ['9.1', 'Divulga a relação dos contratos celebrados em ordem sequencial?', 'essencial'],
      ['9.2', 'Divulga o inteiro teor dos contratos e dos respectivos termos aditivos?', 'essencial'],
      ['9.3', 'Divulga a relação/lista dos fiscais de cada contrato?', 'obrigatorio'],
      ['9.4', 'Divulga a ordem cronológica de seus pagamentos?', 'obrigatorio'],
    ],
  },
  {
    titulo: '10. Obras',
    itens: [
      ['10.1', 'Divulga informações sobre as obras (objeto, situação, datas, percentual)?', 'essencial'],
      ['10.2', 'Divulga os quantitativos, os preços unitários e totais contratados?', 'obrigatorio'],
      ['10.3', 'Divulga os quantitativos executados e os preços efetivamente pagos?', 'obrigatorio'],
      ['10.4', 'Divulga relação das obras paralisadas?', 'recomendado'],
    ],
  },
  {
    titulo: '11. Planejamento e Prestação de Contas',
    itens: [
      ['11.1', 'Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?', 'essencial'],
      ['11.2', 'Divulga o Relatório de Gestão ou Atividades?', 'essencial'],
      ['11.3', 'Divulga a íntegra da decisão da apreciação ou julgamento das contas?', 'obrigatorio'],
      ['11.4', 'Divulga o resultado do julgamento das Contas do Chefe do Poder Executivo?', 'obrigatorio'],
      ['11.5', 'Divulga o Relatório de Gestão Fiscal (RGF)?', 'essencial'],
      ['11.6', 'Divulga o Relatório Resumido da Execução Orçamentária (RREO)?', 'essencial'],
      ['11.7', 'Divulga o plano estratégico institucional?', 'obrigatorio'],
      ['11.8', 'Divulga a Lei do Plano Plurianual (PPA)?', 'essencial'],
      ['11.9', 'Divulga a Lei de Diretrizes Orçamentárias (LDO)?', 'essencial'],
      ['11.10', 'Divulga a Lei Orçamentária (LOA)?', 'essencial'],
    ],
  },
  {
    titulo: '12. Serviço de Informação ao Cidadão - SIC',
    itens: [
      ['12.1', 'Existe o SIC e indica a unidade/setor responsável?', 'essencial'],
      ['12.2', 'Indica o endereço físico, telefone e e-mail do SIC?', 'essencial'],
      ['12.3', 'Há possibilidade de envio de pedidos eletrônicos (e-SIC)?', 'essencial'],
      ['12.4', 'A solicitação por meio de eSic é simples?', 'obrigatorio'],
      ['12.5', 'Divulga instrumento normativo local da LAI?', 'obrigatorio'],
      ['12.6', 'Divulga prazos de resposta e procedimentos?', 'obrigatorio'],
      ['12.7', 'Divulga relatório anual estatístico do SIC?', 'obrigatorio'],
      ['12.8', 'Divulga lista de documentos classificados?', 'obrigatorio'],
      ['12.9', 'Divulga lista das informações desclassificadas?', 'obrigatorio'],
    ],
  },
  {
    titulo: '13. Acessibilidade',
    itens: [
      ['13.1', 'Contém símbolo de acessibilidade em destaque?', 'obrigatorio'],
      ['13.2', 'Contém exibição do "caminho" de páginas?', 'recomendado'],
      ['13.3', 'Contém opção de alto contraste?', 'recomendado'],
      ['13.4', 'Contém ferramenta de redimensionamento de texto?', 'recomendado'],
      ['13.5', 'Contém mapa do site institucional?', 'recomendado'],
    ],
  },
  {
    titulo: '14. Ouvidorias',
    itens: [
      ['14.1', 'Informações sobre o atendimento presencial pela Ouvidoria?', 'essencial'],
      ['14.2', 'Há canal eletrônico de acesso/interação com a ouvidoria?', 'essencial'],
      ['14.3', 'Divulga Carta de Serviços ao Usuário?', 'essencial'],
    ],
  },
  {
    titulo: '15. LGPD e Governo Digital',
    itens: [
      ['15.1', 'Identifica o encarregado pelo tratamento de dados?', 'obrigatorio'],
      ['15.2', 'Publica a sua Política de Privacidade e Proteção de Dados?', 'obrigatorio'],
      ['15.3', 'Possibilita a demanda e o acesso a serviços públicos por meio digital?', 'obrigatorio'],
      ['15.4', 'Possibilita o acesso automatizado em dados abertos?', 'recomendado'],
      ['15.5', 'Regulamenta a Lei do Governo Digital?', 'recomendado'],
      ['15.6', 'Realiza e divulga pesquisas de satisfação?', 'recomendado'],
    ],
  },
  {
    titulo: '16. Renúncias de Receitas',
    itens: [
      ['16.1', 'Divulga as desonerações tributárias concedidas?', 'obrigatorio'],
      ['16.2', 'Divulga os valores da renúncia fiscal prevista e realizada?', 'obrigatorio'],
      ['16.3', 'Identifica os beneficiários das desonerações tributárias?', 'obrigatorio'],
      ['16.4', 'Divulga informações sobre projetos de incentivo à cultura?', 'recomendado'],
    ],
  },
  {
    titulo: '17. Emendas Parlamentares',
    itens: [
      ['17.1', 'Identifica as emendas parlamentares federais recebidas?', 'obrigatorio'],
      ['17.2', 'Identifica as emendas parlamentares estaduais e municipais?', 'obrigatorio'],
      ['17.3', 'Demonstra a execução orçamentária e financeira oriunda das emendas?', 'obrigatorio'],
    ],
  },
  {
    titulo: '18. Saúde',
    itens: [
      ['18.1', 'Divulga o plano de saúde, programação anual e relatório de gestão?', 'obrigatorio'],
      ['18.2', 'Divulga informações relacionadas aos serviços de saúde (horários, profissionais)?', 'obrigatorio'],
      ['18.3', 'Divulga a lista de espera de regulação?', 'obrigatorio'],
      ['18.4', 'Divulga lista dos medicamentos SUS?', 'obrigatorio'],
      ['18.5', 'Divulga os estoques de medicamentos das farmácias públicas?', 'recomendado'],
      ['18.6', 'Divulga informações sobre o Conselho de Saúde?', 'recomendado'],
    ],
  },
  {
    titulo: '19. Educação e Assistência Social',
    itens: [
      ['19.1', 'Divulga o plano de educação e relatório de resultados?', 'obrigatorio'],
      ['19.2', 'Divulga a lista de espera em creches públicas?', 'obrigatorio'],
      ['19.3', 'Divulga informações sobre o Conselho do Fundeb?', 'recomendado'],
      ['19.4', 'Divulga informações sobre o Conselho de Assistência Social?', 'recomendado'],
    ],
  },
];

export const dimensoes: Dimensao[] = dimensoesRaw.map((d) => ({
  titulo: d.titulo,
  criterios: d.itens.map(([id, texto, peso]) => ({
    id,
    dimensao: d.titulo,
    texto,
    peso,
  })),
}));

export const todosCriterios: Criterio[] = dimensoes.flatMap((d) => d.criterios);
