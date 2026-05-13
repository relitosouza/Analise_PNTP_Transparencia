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

<<<<<<< HEAD
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
=======
  const cards = [
    {
      value: `${score}%`,
      label: 'Score PNTP (Programa Nacional)',
      sublabel: rating.label,
      sublabelClass: rating.colorClass,
      valueClass: scoreColorClass(score),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      value: total,
      label: 'Critérios avaliados',
      valueClass: 'text-slate-700',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      value: found,
      label: 'Encontrados',
      valueClass: 'text-emerald-500',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      value: absent,
      label: 'Ausentes',
      valueClass: 'text-red-500',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    {
      value: essentialMissing,
      label: 'Essenciais em falta',
      valueClass: 'text-red-600',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
        >
          <div className="absolute right-3 top-3 rounded-lg bg-slate-100 p-1.5 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">
            {card.icon}
          </div>
          <p className={`text-3xl font-extrabold tracking-tight ${card.valueClass}`}>
            {card.value}
          </p>
          {card.sublabel && (
            <p className={`mt-0.5 text-xs font-bold ${card.sublabelClass}`}>
              [{card.sublabel}]
            </p>
          )}
          <p className="mt-1 text-xs font-medium text-slate-500">{card.label}</p>
        </div>
      ))}
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
    </div>
  );
}
