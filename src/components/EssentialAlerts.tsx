'use client';

import type { RelatorioCriterio } from '@/data/relatorio';

interface Props {
  data: RelatorioCriterio[];
}

export default function EssentialAlerts({ data }: Props) {
  const missing = data.filter((d) => d.status === 'ausente' && d.peso === 'essencial');

  if (missing.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="flex items-center gap-3 border-b border-amber-200/60 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-amber-800">
          Itens ESSENCIAIS ausentes ({missing.length})
        </h3>
      </div>

      <ul className="divide-y divide-amber-100 px-6 py-2">
        {missing.map((item) => (
          <li key={item.id} className="flex items-start gap-2 py-3">
            <span className="mt-0.5 text-red-400">✕</span>
            <div>
              <span className="font-bold text-slate-800">[{item.id}]</span>{' '}
              <span className="text-slate-700">{item.texto}</span>
              <span className="ml-2 text-xs text-slate-400">({item.dimensao})</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
