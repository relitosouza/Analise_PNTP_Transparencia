'use client';

import { useState, useEffect, useCallback } from 'react';
import ITGPTab from '@/components/ITGPTab';
import ITGPCriteriaTable from '@/components/ITGPCriteriaTable';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  itgpPerguntas,
  ITGP_STORAGE_KEY, 
  type ITGPResposta, 
  calcularPontuacaoITGP,
  getClassificacaoITGP
} from '@/data/itgp';

export default function ITGPPage() {
  const [respostas, setRespostas] = useState<Record<string, ITGPResposta>>({});
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'form' | 'table'>('form');
  const [requestedScrollDim, setRequestedScrollDim] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ITGP_STORAGE_KEY);
      if (stored) setRespostas(JSON.parse(stored));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((next: Record<string, ITGPResposta>) => {
    try {
      localStorage.setItem(ITGP_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const handleUpdate = useCallback((id: string, update: Partial<ITGPResposta>) => {
    setRespostas((prev) => {
      const current = prev[id] ?? { status: 'nao_avaliado', observacao: '', url: '' };
      const next = { ...prev, [id]: { ...current, ...update } };
      persist(next);
      return next;
    });
  }, [persist]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent shadow-lg" />
          <p className="mt-4 text-base font-bold text-slate-500 animate-pulse">Sincronizando ITGP...</p>
        </div>
      </div>
    );
  }

  const pontuacao = calcularPontuacaoITGP(respostas);
  const classificacao = getClassificacaoITGP(pontuacao.percentual);
  const totalPerguntas = itgpPerguntas.length;
  const totalAvaliadas = itgpPerguntas.filter(p => respostas[p.id]?.status !== undefined && respostas[p.id]?.status !== 'nao_avaliado').length;
  const progressoTotal = Math.round((totalAvaliadas / totalPerguntas) * 100);

  const dimensoes = Array.from(new Set(itgpPerguntas.map((p) => p.dimensao)));

  return (
    <div className="min-h-screen mesh-gradient -m-gutter p-gutter space-y-unit-8 animate-fadeIn">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary/80">
            <span className="h-px w-8 bg-secondary/30"></span>
            Ciclo Auditória 2025
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-primary">Auditoria <span className="text-secondary">ITGP</span></h2>
          <p className="text-base text-slate-500 max-w-xl">Metodologia da Transparência Internacional Brasil para gestão pública.</p>
        </div>
        
        {/* Modern Sliding Switcher */}
        <div className="flex p-1.5 bg-slate-200/50 backdrop-blur-sm rounded-2xl border border-white/50 w-fit shadow-inner relative overflow-hidden">
          <button
            onClick={() => setActiveView('form')}
            className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
              activeView === 'form' 
                ? 'text-primary' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-base">quiz</span>
            Questionário
            {activeView === 'form' && (
              <span className="absolute inset-0 bg-white shadow-md rounded-xl -z-10 animate-slideRight"></span>
            )}
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
              activeView === 'table' 
                ? 'text-primary' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-base">table_rows</span>
            Tabela Técnica
            {activeView === 'table' && (
              <span className="absolute inset-0 bg-white shadow-md rounded-xl -z-10 animate-slideLeft"></span>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-unit-8">
        {/* Main Content Area */}
        <div className="xl:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeView}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {activeView === 'form' ? (
                <ITGPTab 
                  respostas={respostas} 
                  onUpdate={handleUpdate} 
                  requestedScrollDim={requestedScrollDim}
                  onScrollComplete={() => setRequestedScrollDim(null)}
                />
              ) : (
                <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                  <ITGPCriteriaTable respostas={respostas} onUpdate={handleUpdate} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Sidebar */}
        <div className="xl:col-span-4">
          <div className="sticky top-24 space-y-unit-6">
            {/* Glass Progress Card */}
            <div className="glass-card rounded-[2rem] overflow-hidden shadow-soft border-white/40">
              <div className="bg-gradient-to-br from-primary to-primary-container p-unit-8 text-white relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <span className="material-symbols-outlined text-6xl">verified</span>
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Status da Auditoria</h4>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-6xl font-black tracking-tighter leading-none">{progressoTotal}%</span>
                  <div className="text-right">
                    <p className="text-xs font-bold opacity-80">{totalAvaliadas} itens</p>
                    <p className="text-[10px] uppercase opacity-50 tracking-widest">de {totalPerguntas} totais</p>
                  </div>
                </div>
                <div className="mt-8 h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-tertiary-fixed-dim to-emerald-400 rounded-full shadow-[0_0_15px_rgba(109,221,129,0.5)] transition-all duration-1000 ease-out" 
                    style={{ width: `${progressoTotal}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-unit-8 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Progresso Detalhado</p>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md ${classificacao.color} bg-white shadow-sm border border-slate-100`}>
                    {classificacao.label}
                  </span>
                </div>
                <div className="space-y-4">
                  {dimensoes.map(dim => {
                    const d = pontuacao.porDimensao[dim];
                    const pct = d?.percentual ?? 0;
                    const isDone = pct === 100;
                    return (
                      <div 
                        key={dim} 
                        className="group cursor-pointer"
                        onClick={() => {
                          setActiveView('form');
                          setRequestedScrollDim(dim);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-on-surface truncate pr-4 group-hover:text-secondary transition-colors" title={dim}>{dim}</span>
                          <span className={`text-[10px] font-black ${isDone ? 'text-emerald-500' : 'text-slate-400'}`}>{pct}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${isDone ? 'bg-emerald-400' : 'bg-slate-300'}`} 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-unit-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
                 <button className="w-full flex items-center justify-center gap-2 group">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">Ver Relatório Completo</span>
                    <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1">arrow_forward</span>
                 </button>
              </div>
            </div>

            {/* Actions Card */}
            <div className="glass-card rounded-[2rem] p-unit-8 space-y-6 border-white/60">
              <div className="space-y-4">
                <button className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-[0_10px_20px_-5px_rgba(0,30,64,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,30,64,0.4)] hover:-translate-y-1 transition-all active:scale-[0.98]">
                  Salvar Rascunho
                </button>
                <button className="w-full h-14 border-2 border-primary text-primary rounded-2xl font-black text-sm hover:bg-white hover:shadow-xl transition-all active:scale-[0.98]">
                  Enviar Auditoria
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sincronizado há poucos segundos
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
