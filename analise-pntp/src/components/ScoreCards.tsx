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

  const cards = [
    {
      value: `${score}%`,
      label: 'Score PNTP 2026',
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
    </div>
  );
}
