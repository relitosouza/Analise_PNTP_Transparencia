import { todosCriteriosITGP } from './itgp_criterios';
import type { RelatorioCriterio } from './relatorio';

export function buildRelatorioITGP(): RelatorioCriterio[] {
  return todosCriteriosITGP.map((criterio) => {
    return {
      id: criterio.id,
      dimensao: criterio.dimensao,
      texto: criterio.texto,
      peso: criterio.peso as any, // Mapping ITGP weights to PNTP weights for UI compatibility
      status: 'ausente', // Default to ausente for now
      observacao: 'Critério ITGP aguardando análise.',
      url: '',
      menuPath: 'Não identificado',
    };
  });
}
