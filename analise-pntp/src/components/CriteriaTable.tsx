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
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Detalhamento Completo dos Critérios
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3">
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
        >
          <option value="">Todas Dimensões</option>
          {dims.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400"
        >
          <option value="">Todos Status</option>
          <option value="ok">Encontrados</option>
          <option value="ausente">Ausentes</option>
        </select>
        <select
          value={filterPeso}
          onChange={(e) => setFilterPeso(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400"
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
            <tr className="border-b border-slate-100 bg-[#0d2b4e] text-white">
              <th className="px-4 py-3 text-center text-xs font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Critério</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Peso</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Observação</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">URL Portal</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Ação</th>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditId(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold text-slate-800">Editar Critério {editId}</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Observação</label>
                <textarea
                  value={editObs}
                  onChange={(e) => setEditObs(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
          <td colSpan={7} className="bg-[#0d2b4e] px-4 py-2 text-xs font-bold tracking-wide text-white">
            {item.dimensao}
          </td>
        </tr>
      )}
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
        <td className="px-4 py-3 text-center">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${pesoC.bg} ${pesoC.text} ${pesoC.border}`}>
            {pesoLabel(item.peso)}
          </span>
        </td>
        <td className="max-w-[200px] px-4 py-3 text-xs text-slate-500">{item.observacao}</td>
        <td className="max-w-[180px] px-4 py-3">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-mono text-[11px] text-blue-600 hover:underline"
            >
              {item.url.length > 60 ? item.url.slice(0, 60) + '...' : item.url}
            </a>
          ) : (
            <span className="text-[11px] italic text-slate-300">ausente no portal</span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={onEdit}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Editar
          </button>
        </td>
      </tr>
    </>
  );
}
