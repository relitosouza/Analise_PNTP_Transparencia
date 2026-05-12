'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RelatorioCriterio } from '@/data/relatorio';

interface PNTPTabProps {
  data: RelatorioCriterio[];
  onUpdate: (id: string, status: string, url: string, obs: string) => void;
  requestedScrollDim?: string | null;
  onScrollComplete?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PNTPTab({ 
  data, 
  onUpdate,
  requestedScrollDim,
  onScrollComplete
}: PNTPTabProps) {
  const [expandedDims, setExpandedDims] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (requestedScrollDim) {
      setExpandedDims(prev => ({ ...prev, [requestedScrollDim]: true }));
      const el = document.getElementById(`dim-${requestedScrollDim}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onScrollComplete?.();
    }
  }, [requestedScrollDim, onScrollComplete]);

  const dimensoes = Array.from(new Set(data.map((p) => p.dimensao)));

  const toggleDim = (dim: string) => {
    setExpandedDims((prev) => ({ ...prev, [dim]: !prev[dim] }));
  };

  if (dimensoes.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-unit-12 rounded-3xl border-2 border-dashed border-slate-200 text-center"
      >
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
        <p className="text-slate-400 font-black uppercase tracking-widest">Nenhum critério PNTP localizado.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-gutter"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {dimensoes.map((dim) => {
        const perguntas = data.filter((p) => p.dimensao === dim);
        const isExpanded = expandedDims[dim] !== false;
        const total = perguntas.length;
        const avaliadas = perguntas.filter(p => p.status === 'ok').length;
        const pct = Math.round((avaliadas / total) * 100);

        let icon = 'payments';
        if (dim.toLowerCase().includes('receita')) icon = 'trending_up';
        if (dim.toLowerCase().includes('despesa')) icon = 'shopping_cart';
        if (dim.toLowerCase().includes('licitação')) icon = 'gavel';
        if (dim.toLowerCase().includes('pessoal')) icon = 'groups';
        if (dim.toLowerCase().includes('institucional')) icon = 'account_balance';

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
                  className="bg-primary text-white p-2.5 rounded-xl material-symbols-outlined shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  {icon}
                </motion.span>
                <div>
                  <h3 className="font-headline-md text-xl text-primary tracking-tight">{dim}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-black opacity-60">Ciclo PNTP 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.span 
                  layout
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${pct === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  {avaliadas}/{total} Itens
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
                      <PNTPQuestionItem
                        key={p.id}
                        index={idx}
                        pergunta={p}
                        onUpdate={(status, url, obs) => onUpdate(p.id, status, url, obs)}
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

function PNTPQuestionItem({
  pergunta,
  index,
  onUpdate,
}: {
  pergunta: RelatorioCriterio;
  index: number;
  onUpdate: (status: string, url: string, obs: string) => void;
}) {
  const isOk = pergunta.status === 'ok';

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
            <span className={`ml-3 inline-block rounded-md px-2 py-0.5 text-[10px] font-black tracking-widest ${pergunta.peso === 'Essencial' ? 'bg-error text-white' : 'bg-slate-100 text-slate-500'}`}>
              {pergunta.peso.toUpperCase()}
            </span>
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-unit-6">
        <motion.label 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
            isOk 
              ? 'border-secondary bg-surface-container-low shadow-elevation-2' 
              : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <input 
            type="radio" 
            checked={isOk}
            onChange={() => onUpdate('ok', pergunta.url, pergunta.observacao)}
            className="text-secondary focus:ring-secondary h-5 w-5"
          />
          <span className={`text-sm font-black ${isOk ? 'text-secondary' : 'text-slate-500'}`}>Conforme (Sim)</span>
        </motion.label>
        
        <motion.label 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
            pergunta.status === 'ausente' 
              ? 'border-error bg-error-container/20 shadow-elevation-2' 
              : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <input 
            type="radio" 
            checked={pergunta.status === 'ausente'}
            onChange={() => onUpdate('ausente', pergunta.url, pergunta.observacao)}
            className="text-error focus:ring-error h-5 w-5"
          />
          <span className={`text-sm font-black ${pergunta.status === 'ausente' ? 'text-error' : 'text-slate-500'}`}>Não Conforme (Não)</span>
        </motion.label>

        <div className="flex items-center justify-center p-4 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-black text-slate-300 uppercase tracking-widest italic bg-slate-50/30">
          Não Aplicável PNTP
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-6">
        <motion.div layout>
          <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">URL do Portal (Evidência)</label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-secondary transition-colors">link</span>
            <input 
              type="url"
              value={pergunta.url || ''}
              onChange={(e) => onUpdate(pergunta.status, e.target.value, pergunta.observacao)}
              placeholder="https://..."
              className="w-full pl-10 h-12 border-2 border-slate-100 rounded-2xl focus:border-secondary outline-none font-data-mono text-sm transition-all"
            />
          </div>
        </motion.div>
        <motion.div layout>
          <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Justificativa da Auditoria</label>
          <div className="relative group">
             <span className="absolute left-3 top-4 material-symbols-outlined text-slate-300 group-focus-within:text-secondary transition-colors">edit_note</span>
             <textarea 
               value={pergunta.observacao || ''}
               onChange={(e) => onUpdate(pergunta.status, pergunta.url, e.target.value)}
               rows={1}
               placeholder="Notas técnicas..."
               className="w-full pl-10 pr-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-secondary outline-none text-sm min-h-[48px] resize-none transition-all"
             />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
