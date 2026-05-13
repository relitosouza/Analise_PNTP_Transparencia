'use client';

import { useState, useMemo } from 'react';
import { itgpPerguntas, type ITGPResposta, type ITGPStatus } from '@/data/itgp';

interface Props {
  respostas: Record<string, ITGPResposta>;
  onUpdate: (id: string, update: Partial<ITGPResposta>) => void;
}

const SCORE_LABELS: Record<string, string> = {
  '1': 'Sim',
  '0.75': '3/4',
  '0.66': '2/3',
  '0.5': 'Parcial',
  '0.33': '1/3',
  '0.25': '1/4',
  '0': 'Não',
  'nao_avaliado': '—'
};

export default function ITGPCriteriaTable({ respostas, onUpdate }: Props) {
  const [filterDim, setFilterDim] = useState('');
  const [filterScore, setFilterScore] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<ITGPStatus>('nao_avaliado');
  const [editUrl, setEditUrl] = useState('');
  const [editObs, setEditObs] = useState('');

  const dims = useMemo(() => [...new Set(itgpPerguntas.map((p) => p.dimensao))], []);

  const filtered = useMemo(() => {
    return itgpPerguntas.filter((p) => {
      const resp = respostas[p.id];
      const status = resp?.status ?? 'nao_avaliado';

      if (filterDim && p.dimensao !== filterDim) return false;
      if (filterScore && status.toString() !== filterScore) return false;
      if (search && !p.texto.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [respostas, filterDim, filterScore, search]);

  const handleSave = () => {
    if (editId) {
      onUpdate(editId, { status: editStatus, url: editUrl, observacao: editObs });
      setEditId(null);
    }
  };

  const openEdit = (p: typeof itgpPerguntas[0]) => {
    const r = respostas[p.id];
    setEditId(p.id);
    setEditStatus(r?.status ?? 'nao_avaliado');
    setEditUrl(r?.url ?? '');
    setEditObs(r?.observacao ?? '');
  };

  let lastDim = '';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-on-surface">
          <span className="material-symbols-outlined text-secondary">list_alt</span>
          Detalhamento Completo dos Critérios ITGP
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Buscar critério ITGP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-sm text-on-surface placeholder-slate-400 shadow-sm outline-none transition-colors focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>
        <select
          value={filterDim}
          onChange={(e) => setFilterDim(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-on-surface shadow-sm outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">Todas Dimensões</option>
          {dims.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={filterScore}
          onChange={(e) => setFilterScore(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-on-surface shadow-sm outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">Todos Status</option>
          <option value="1">✓ Sim (1.0)</option>
          <option value="0.5">½ Parcial (0.5)</option>
          <option value="0">✕ Não (0.0)</option>
          <option value="nao_avaliado">Não avaliado</option>
        </select>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} de {itgpPerguntas.length}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-primary text-white">
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Score</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Critério</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Peso</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Observação</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Evidência</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const showDimSep = p.dimensao !== lastDim;
              if (showDimSep) lastDim = p.dimensao;

              const r = respostas[p.id];
              const score = r?.status ?? 'nao_avaliado';
              const label = SCORE_LABELS[score.toString()] || '—';

              return (
                <ITGPTableRow
                  key={p.id}
                  pergunta={p}
                  res={r}
                  score={score}
                  label={label}
                  showDimSep={showDimSep}
                  onEdit={() => openEdit(p)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setEditId(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold text-primary">Editar Critério ITGP {editId}</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Status / Pontuação</label>
                <select
                  value={editStatus.toString()}
                  onChange={(e) => setEditStatus(e.target.value === 'nao_avaliado' ? 'nao_avaliado' : parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="nao_avaliado">Não avaliado</option>
                  {itgpPerguntas.find(p => p.id === editId)?.opcoes.map((opt) => (
                    <option key={opt.valor} value={opt.valor.toString()}>
                      {opt.label} ({opt.valor})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">URL da Evidência</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Observação Técnica</label>
                <textarea
                  value={editObs}
                  onChange={(e) => setEditObs(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditId(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ITGPTableRow({
  pergunta,
  res,
  score,
  label,
  showDimSep,
  onEdit,
}: {
  pergunta: typeof itgpPerguntas[0];
  res: ITGPResposta | undefined;
  score: ITGPStatus;
  label: string;
  showDimSep: boolean;
  onEdit: () => void;
}) {
  const isOk = score === 1;
  const isPartial = typeof score === 'number' && score > 0 && score < 1;
  const isFail = score === 0;

  return (
    <>
      {showDimSep && (
        <tr>
          <td colSpan={7} className="bg-primary-container px-4 py-2 text-xs font-bold tracking-wide text-white">
            {pergunta.dimensao}
          </td>
        </tr>
      )}
      <tr className={`border-b transition-colors group ${isOk ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : isFail ? 'bg-red-50/20 hover:bg-red-50/40' : isPartial ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-slate-50'}`}>
        <td className="px-4 py-3 text-center">
          <div className={`mx-auto w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black border ${isOk ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : isFail ? 'bg-red-100 text-red-700 border-red-200' : isPartial ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            {label}
          </div>
        </td>
        <td className="px-4 py-3 font-bold text-primary font-mono text-xs">{pergunta.id}</td>
        <td className="max-w-xs px-4 py-3">
           <p className="text-on-surface font-bold text-xs">{pergunta.texto}</p>
           <p className="text-[10px] text-slate-400 mt-1 italic">{pergunta.guia}</p>
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-black ${
            pergunta.peso >= 3 ? 'bg-secondary text-white shadow-sm' : 
            pergunta.peso === 2 ? 'bg-primary-container text-white' : 
            'bg-slate-200 text-slate-600'
          }`}>
            P{pergunta.peso}
          </span>
        </td>
        <td className="max-w-[200px] px-4 py-3 text-[11px] text-slate-500">{res?.observacao || '—'}</td>
        <td className="max-w-[180px] px-4 py-3">
          {res?.url ? (
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-secondary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">link</span>
              EVIDÊNCIA
            </a>
          ) : (
            <span className="text-[10px] italic text-slate-300">não informada</span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={onEdit}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black text-slate-500 transition-all hover:border-secondary hover:bg-secondary/5 hover:text-secondary flex items-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-xs">edit_note</span>
            EDITAR
          </button>
        </td>
      </tr>
    </>
  );
}
