'use client';

<<<<<<< HEAD
import { useState } from 'react';
=======
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
import type { RelatorioCriterio } from '@/data/relatorio';
import { calcScore, scoreBgClass, scoreColorClass } from '@/lib/utils';

interface Props {
  data: RelatorioCriterio[];
}

export default function DimensionSummary({ data }: Props) {
<<<<<<< HEAD
  const [openDims, setOpenDims] = useState<Record<string, boolean>>({});

=======
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
  // Group by dimension
  const dims = new Map<string, RelatorioCriterio[]>();
  for (const item of data) {
    const existing = dims.get(item.dimensao) || [];
    existing.push(item);
    dims.set(item.dimensao, existing);
  }

  const rows = Array.from(dims.entries()).map(([dim, items]) => {
    const total = items.length;
    const found = items.filter((i) => i.status === 'ok').length;
    const pct = calcScore(found, total);
    return { dim, total, found, absent: total - found, pct };
  });

<<<<<<< HEAD
  const toggleDim = (dim: string) => {
    setOpenDims((prev) => ({ ...prev, [dim]: !prev[dim] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <span className="material-symbols-outlined text-secondary">analytics</span>
        <h2 className="text-base font-bold text-primary">Resultado por Dimensão</h2>
      </div>

      <div className="grid gap-3">
        {rows.map((r) => {
          const isOpen = !!openDims[r.dim];
          return (
            <div 
              key={r.dim} 
              className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-200"
            >
              <button
                onClick={() => toggleDim(r.dim)}
                className={`w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50 ${isOpen ? 'bg-slate-50/80 border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${r.pct >= 80 ? 'bg-emerald-100 text-emerald-700' : r.pct >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {r.pct.toFixed(0)}%
                  </div>
                  <span className="text-sm font-bold text-primary truncate">{r.dim}</span>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="hidden sm:flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${scoreBgClass(r.pct)}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                   </div>
                   <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-container-low/30">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                    <p className="text-xl font-bold text-primary">{r.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Encontrados</p>
                    <p className="text-xl font-bold text-emerald-600">{r.found}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Ausentes</p>
                    <p className="text-xl font-bold text-red-500">{r.absent}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Progresso</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold ${scoreColorClass(r.pct)}`}>{r.pct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-4 bg-surface-container-low/30">
                   <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
=======
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Resultado por Dimensão
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-6 py-3 text-left font-semibold text-slate-600">Dimensão</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">Total</th>
              <th className="px-4 py-3 text-center font-semibold text-emerald-600">Encontrados</th>
              <th className="px-4 py-3 text-center font-semibold text-red-600">Ausentes</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-600">Progresso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.dim} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-3 font-semibold text-slate-700">{r.dim}</td>
                <td className="px-4 py-3 text-center text-slate-600">{r.total}</td>
                <td className="px-4 py-3 text-center font-bold text-emerald-600">{r.found}</td>
                <td className="px-4 py-3 text-center font-bold text-red-500">{r.absent}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${scoreBgClass(r.pct)}`}
                        style={{ width: `${r.pct}%` }}
                      />
<<<<<<< HEAD
                   </div>
                </div>
              </div>
            </div>
          );
        })}
=======
                    </div>
                    <span className={`min-w-[44px] text-right text-xs font-bold ${scoreColorClass(r.pct)}`}>
                      {r.pct.toFixed(0)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
      </div>
    </div>
  );
}
