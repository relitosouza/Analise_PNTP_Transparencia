'use client';

import { useState, useMemo } from 'react';
import type { RelatorioCriterio } from '@/data/relatorio';
import { pesoLabel, pesoColorClasses } from '@/lib/utils';
import type { Peso } from '@/data/criterios';

interface Props {
  data: RelatorioCriterio[];
  onStatusUpdate: (id: string, status: string, url: string, obs: string) => void;
}

export default function CriteriaTable({ data, onStatusUpdate }: Props) {
  const [filterDim, setFilterDim] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeso, setFilterPeso] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('ok');
  const [editUrl, setEditUrl] = useState('');
  const [editObs, setEditObs] = useState('');

  const dims = useMemo(() => [...new Set(data.map((d) => d.dimensao))], [data]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filterDim && item.dimensao !== filterDim) return false;
      if (filterStatus && item.status !== filterStatus) return false;
      if (filterPeso && item.peso !== filterPeso) return false;
      if (search && !item.texto.toLowerCase().includes(search.toLowerCase()) && !item.id.includes(search)) return false;
      return true;
    });
  }, [data, filterDim, filterStatus, filterPeso, search]);

  const handleSave = () => {
    if (editId) {
      onStatusUpdate(editId, editStatus, editUrl, editObs);
      setEditId(null);
    }
  };

  const openEdit = (item: RelatorioCriterio) => {
    setEditId(item.id);
    setEditStatus(item.status);
    setEditUrl(item.url);
    setEditObs(item.observacao);
  };

  let lastDim = '';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
<<<<<<< HEAD
        <h2 className="flex items-center gap-2 text-base font-bold text-on-surface">
          <span className="material-symbols-outlined text-secondary">list_alt</span>
=======
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
          Detalhamento Completo dos Critérios
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3">
<<<<<<< HEAD
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Buscar critério..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-sm text-on-surface placeholder-slate-400 shadow-sm outline-none transition-colors focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>
        <select
          value={filterDim}
          onChange={(e) => setFilterDim(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-on-surface shadow-sm outline-none focus:ring-2 focus:ring-secondary"
=======
        <input
          type="text"
          placeholder="Buscar critério..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={filterDim}
          onChange={(e) => setFilterDim(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400"
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
        >
          <option value="">Todas Dimensões</option>
          {dims.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
<<<<<<< HEAD
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-on-surface shadow-sm outline-none focus:ring-2 focus:ring-secondary"
=======
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400"
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
        >
          <option value="">Todos Status</option>
          <option value="ok">Encontrados</option>
          <option value="ausente">Ausentes</option>
        </select>
        <select
          value={filterPeso}
          onChange={(e) => setFilterPeso(e.target.value)}
<<<<<<< HEAD
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-on-surface shadow-sm outline-none focus:ring-2 focus:ring-secondary"
=======
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400"
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
        >
          <option value="">Todos Pesos</option>
          <option value="essencial">Essencial</option>
          <option value="obrigatorio">Obrigatório</option>
          <option value="recomendado">Recomendado</option>
        </select>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} de {data.length}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
<<<<<<< HEAD
            <tr className="border-b border-slate-100 bg-primary text-white">
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Critério</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Peso</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Observação</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">URL Portal</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Ação</th>
=======
            <tr className="border-b border-slate-100 bg-[#0d2b4e] text-white">
              <th className="px-4 py-3 text-center text-xs font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Critério</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Peso</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Observação</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">URL Portal</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Ação</th>
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const showDimSep = item.dimensao !== lastDim;
              if (showDimSep) lastDim = item.dimensao;

              const isOk = item.status === 'ok';
              const pesoC = pesoColorClasses(item.peso);

              return (
                <TableRow
                  key={item.id}
                  item={item}
                  isOk={isOk}
                  pesoC={pesoC}
                  showDimSep={showDimSep}
                  onEdit={() => openEdit(item)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editId && (
<<<<<<< HEAD
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setEditId(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold text-primary">Editar Critério {editId}</h3>
=======
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditId(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold text-slate-800">Editar Critério {editId}</h3>
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
<<<<<<< HEAD
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary"
=======
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
                >
                  <option value="ok">✓ Encontrado</option>
                  <option value="ausente">✕ Ausente</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">URL</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
<<<<<<< HEAD
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary"
=======
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Observação</label>
                <textarea
                  value={editObs}
                  onChange={(e) => setEditObs(e.target.value)}
<<<<<<< HEAD
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary"
=======
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
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
<<<<<<< HEAD
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
=======
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TableRow({
  item,
  isOk,
  pesoC,
  showDimSep,
  onEdit,
}: {
  item: RelatorioCriterio;
  isOk: boolean;
  pesoC: ReturnType<typeof pesoColorClasses>;
  showDimSep: boolean;
  onEdit: () => void;
}) {
  return (
    <>
      {showDimSep && (
        <tr>
<<<<<<< HEAD
          <td colSpan={7} className="bg-primary-container px-4 py-2 text-xs font-bold tracking-wide text-white">
=======
          <td colSpan={7} className="bg-[#0d2b4e] px-4 py-2 text-xs font-bold tracking-wide text-white">
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
            {item.dimensao}
          </td>
        </tr>
      )}
<<<<<<< HEAD
      <tr className={`border-b transition-colors group ${isOk ? 'border-l-4 border-l-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/60' : 'border-l-4 border-l-red-300 bg-red-50/30 hover:bg-red-50/60'}`}>
        <td className="px-4 py-3 text-center">
          {isOk ? (
            <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
          ) : (
            <span className="material-symbols-outlined text-error text-lg">cancel</span>
          )}
        </td>
        <td className="px-4 py-3 font-bold text-primary">{item.id}</td>
        <td className="max-w-xs px-4 py-3 text-on-surface">{item.texto}</td>
=======
      <tr className={`border-b transition-colors ${isOk ? 'border-l-4 border-l-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/60' : 'border-l-4 border-l-red-300 bg-red-50/30 hover:bg-red-50/60'}`}>
        <td className="px-4 py-3 text-center">
          {isOk ? (
            <span className="text-lg text-emerald-500">✓</span>
          ) : (
            <span className="text-lg text-red-500">✕</span>
          )}
        </td>
        <td className="px-4 py-3 font-bold text-[#0d2b4e]">{item.id}</td>
        <td className="max-w-xs px-4 py-3 text-slate-700">{item.texto}</td>
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
        <td className="px-4 py-3 text-center">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${pesoC.bg} ${pesoC.text} ${pesoC.border}`}>
            {pesoLabel(item.peso)}
          </span>
        </td>
<<<<<<< HEAD
        <td className="max-w-[200px] px-4 py-3 text-xs text-slate-500 italic">{item.observacao}</td>
=======
        <td className="max-w-[200px] px-4 py-3 text-xs text-slate-500">{item.observacao}</td>
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
        <td className="max-w-[180px] px-4 py-3">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
<<<<<<< HEAD
              className="break-all font-mono text-[11px] text-secondary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">link</span>
              Link Portal
            </a>
          ) : (
            <span className="text-[11px] italic text-slate-300">ausente</span>
=======
              className="break-all font-mono text-[11px] text-blue-600 hover:underline"
            >
              {item.url.length > 60 ? item.url.slice(0, 60) + '...' : item.url}
            </a>
          ) : (
            <span className="text-[11px] italic text-slate-300">ausente no portal</span>
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
          )}
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={onEdit}
<<<<<<< HEAD
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-all hover:border-secondary hover:bg-secondary/5 hover:text-secondary flex items-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-xs">edit</span>
            EDITAR
=======
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Editar
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
          </button>
        </td>
      </tr>
    </>
  );
}
