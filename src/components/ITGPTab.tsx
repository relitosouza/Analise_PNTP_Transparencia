'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  itgpPerguntas,
  calcularPontuacaoITGP,
  getClassificacaoITGP,
  type ITGPResposta,
  type ITGPStatus,
} from '@/data/itgp';

interface ITGPTabProps {
  respostas: Record<string, ITGPResposta>;
  onUpdate: (id: string, update: Partial<ITGPResposta>) => void;
  requestedScrollDim?: string | null;
  onScrollComplete?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ITGPTab({ 
  respostas, 
  onUpdate,
  requestedScrollDim,
  onScrollComplete
}: ITGPTabProps) {
  const [expandedDims, setExpandedDims] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (requestedScrollDim) {
      setExpandedDims(prev => ({ ...prev, [requestedScrollDim]: true }));
      const el = document.getElementById(`dim-${requestedScrollDim}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add a small offset if needed, but smooth scroll is usually enough
      }
      onScrollComplete?.();
    }
  }, [requestedScrollDim, onScrollComplete]);

  function setStatus(id: string, status: ITGPStatus) {
    onUpdate(id, { status });
  }

  function toggleDim(dim: string) {
    setExpandedDims((prev) => ({ ...prev, [dim]: !prev[dim] }));
  }

  const pontuacao = calcularPontuacaoITGP(respostas);
  const dimensoes = Array.from(new Set(itgpPerguntas.map((p) => p.dimensao)));

  return (
    <motion.div 
      className="space-y-gutter"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {dimensoes.map((dim) => {
        const perguntas = itgpPerguntas.filter((p) => p.dimensao === dim);
        const isExpanded = expandedDims[dim] !== false;
        
        const dimStats = pontuacao.porDimensao[dim];
        const pct = dimStats?.percentual ?? 0;
        const total = dimStats?.totalPerguntas ?? 0;
        const avaliados = perguntas.filter(p => respostas[p.id]?.status !== undefined && respostas[p.id]?.status !== 'nao_avaliado').length;

        let icon = 'gavel'; // Default for Legal
        if (dim.toLowerCase().includes('plataformas')) icon = 'desktop_windows';
        if (dim.toLowerCase().includes('governança')) icon = 'account_balance';
        if (dim.toLowerCase().includes('obras')) icon = 'construction';
        if (dim.toLowerCase().includes('financeira')) icon = 'trending_up';
        if (dim.toLowerCase().includes('comunicação')) icon = 'forum';
        if (dim.toLowerCase().includes('saúde')) icon = 'medical_services';
        if (dim.toLowerCase().includes('climática')) icon = 'thermostat';

        return (
          <motion.section 
            key={dim} 
            id={`dim-${dim}`}
            variants={itemVariants}
            className="bg-white border border-outline-variant shadow-soft rounded-2xl overflow-hidden"
          >
            <motion.header 
              className="flex items-center justify-between p-unit-6 border-b border-surface-container cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleDim(dim)}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            >
              <div className="flex items-center gap-4">
                <motion.span 
                  className="bg-primary-container text-on-primary-container p-2 rounded-xl material-symbols-outlined shadow-elevation-1"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {icon}
                </motion.span>
                <div>
                  <h3 className="font-headline-md text-xl text-primary tracking-tight">{dim}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-black opacity-60">Dimensão ITGP 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.span 
                  layout
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${pct === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  {avaliados}/{total} Avaliados
                </motion.span>
                <motion.span 
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="material-symbols-outlined text-slate-400"
                >
                  expand_more
                </motion.span>
              </div>
            </motion.header>

            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-unit-6 space-y-unit-8">
                    {perguntas.map((p, idx) => (
                      <PerguntaItem
                        key={p.id}
                        index={idx}
                        pergunta={p}
                        resposta={respostas[p.id]}
                        onStatus={(s) => setStatus(p.id, s)}
                        onUpdate={(upd) => onUpdate(p.id, upd)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </motion.div>
  );
}

function PerguntaItem({
  pergunta,
  index,
  resposta,
  onStatus,
  onUpdate,
}: {
  pergunta: (typeof itgpPerguntas)[number];
  index: number;
  resposta: ITGPResposta | undefined;
  onStatus: (s: ITGPStatus) => void;
  onUpdate: (upd: Partial<ITGPResposta>) => void;
}) {
  const status = resposta?.status ?? 'nao_avaliado';

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="pb-unit-8 border-b border-surface-container last:border-0 last:pb-0"
    >
      <div className="flex items-start gap-4 mb-unit-6">
        <span className="text-xs font-black text-slate-300 font-mono pt-1.5 shrink-0">{pergunta.id}</span>
        <div className="flex-1">
          <h4 className="font-bold text-lg text-on-surface leading-tight tracking-tight">
            {pergunta.texto}
            <span className={`ml-3 inline-block rounded-md px-2 py-0.5 text-[10px] font-black tracking-widest ${pergunta.peso === 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              PESO {pergunta.peso}
            </span>
          </h4>
          {pergunta.guia && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 italic">
              <span className="material-symbols-outlined text-sm">info</span>
              {pergunta.guia}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-unit-6">
        {pergunta.opcoes.map((opt) => {
          const isActive = status === opt.valor;
          return (
            <motion.label 
              key={opt.valor}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0,94,178,0.02)" }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                isActive 
                  ? 'border-secondary bg-surface-container-low shadow-elevation-2' 
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <input 
                type="radio" 
                name={pergunta.id}
                checked={isActive}
                onChange={() => onStatus(opt.valor)}
                className="text-secondary focus:ring-secondary h-5 w-5"
              />
              <span className={`text-sm font-black ${isActive ? 'text-secondary' : 'text-slate-500'}`}>
                {opt.label}
              </span>
            </motion.label>
          );
        })}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStatus('nao_avaliado')}
          className={`flex items-center justify-center gap-2 p-4 border-2 rounded-2xl text-sm font-black transition-all ${
            status === 'nao_avaliado'
              ? 'border-slate-300 bg-slate-50 text-slate-700'
              : 'border-dashed border-slate-200 text-slate-300 hover:text-slate-500 hover:border-slate-300'
          }`}
        >
          Resetar
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-6">
        <motion.div layout>
          <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">URL de Evidência</label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-secondary transition-colors">link</span>
            <input 
              type="url"
              value={resposta?.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://..."
              className="w-full pl-10 h-12 border-2 border-slate-100 rounded-2xl focus:border-secondary outline-none font-data-mono text-sm transition-all"
            />
          </div>
        </motion.div>
        <motion.div layout>
          <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Observações Técnicas</label>
          <div className="relative group">
             <span className="absolute left-3 top-4 material-symbols-outlined text-slate-300 group-focus-within:text-secondary transition-colors">edit_note</span>
             <textarea 
               value={resposta?.observacao || ''}
               onChange={(e) => onUpdate({ observacao: e.target.value })}
               rows={1}
               placeholder="Notas sobre a conformidade..."
               className="w-full pl-10 pr-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-secondary outline-none text-sm min-h-[48px] resize-none transition-all"
             />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
