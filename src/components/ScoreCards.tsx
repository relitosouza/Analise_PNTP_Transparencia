'use client';

import { calcScore, getRating, scoreColorClass } from '@/lib/utils';
import type { RelatorioCriterio } from '@/data/relatorio';

interface Props {
  data: RelatorioCriterio[];
}

export default function ScoreCards({ data }: Props) {
  const total = data.length;
  const found = data.filter((d) => d.status === 'ok').length;
  const absent = total - found;
  const essentialMissing = data.filter((d) => d.status === 'ausente' && d.peso === 'essencial').length;
  const score = calcScore(found, total);
  const rating = getRating(score);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Scorecard: PNTP Score */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-secondary-fixed text-on-secondary-fixed rounded-lg">
              <span className="material-symbols-outlined">query_stats</span>
            </span>
            <span className="text-tertiary font-bold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +0.0%
            </span>
          </div>
          <p className="text-slate-500 text-label-sm font-label-sm uppercase tracking-wider mb-1">Score PNTP</p>
          <h3 className="text-headline-md font-headline-md text-primary">
            {score}% <span className="text-sm font-normal text-slate-400">/ 100</span>
          </h3>
          <p className={`mt-1 text-xs font-bold ${rating.colorClass}`}>
            [{rating.label}]
          </p>
        </div>
        <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-secondary" style={{ width: `${score}%` }}></div>
        </div>
      </div>

      {/* Scorecard: Entidades Avaliadas */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-surface-container text-on-secondary-container rounded-lg">
              <span className="material-symbols-outlined">business</span>
            </span>
          </div>
          <p className="text-slate-500 text-label-sm font-label-sm uppercase tracking-wider mb-1">Critérios</p>
          <h3 className="text-headline-md font-headline-md text-primary">{total}</h3>
        </div>
        <p className="text-xs text-slate-400 mt-4">Total mapeado Atricon</p>
      </div>

      {/* Scorecard: Alertas */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-error hover:shadow-md transition-shadow">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-error-container text-on-error-container rounded-lg">
              <span className="material-symbols-outlined">warning</span>
            </span>
          </div>
          <p className="text-slate-500 text-label-sm font-label-sm uppercase tracking-wider mb-1">Ausentes</p>
          <h3 className="text-headline-md font-headline-md text-error">{absent}</h3>
        </div>
        <p className="text-xs text-slate-400 mt-4">{essentialMissing} essenciais em falta</p>
      </div>

      {/* Scorecard: Status Geral */}
      <div className="bg-primary-container p-6 rounded-xl border border-primary-container shadow-sm flex flex-col justify-between text-white hover:shadow-md transition-shadow">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-white/10 rounded-lg">
              <span className="material-symbols-outlined text-white">verified</span>
            </span>
          </div>
          <p className="text-blue-200 text-label-sm font-label-sm uppercase tracking-wider mb-1">Resiliência</p>
          <h3 className="text-headline-md font-headline-md">{rating.label}</h3>
        </div>
        <p className="text-xs text-blue-300 mt-4">Nível de Transparência</p>
      </div>
    </div>
  );
}
