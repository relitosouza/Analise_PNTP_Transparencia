'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ScoreCards from '@/components/ScoreCards';
import DimensionSummary from '@/components/DimensionSummary';
import EssentialAlerts from '@/components/EssentialAlerts';
import CriteriaTable from '@/components/CriteriaTable';
import { buildRelatorio } from '@/data/relatorio';
import type { RelatorioCriterio } from '@/data/relatorio';
import { PORTAL_URL } from '@/lib/utils';

export default function HomePage() {
  const [data, setData] = useState<RelatorioCriterio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Build initial report data
    const report = buildRelatorio();

    // Try to load manual overrides from API
    fetch('/api/updates')
      .then((res) => res.json())
      .then((json) => {
        const manualUpdates = json.manual_updates || {};
        const updated = report.map((item) => {
          const override = manualUpdates[item.id];
          if (override) {
            return {
              ...item,
              status: override.status === 'ok' ? ('ok' as const) : ('ausente' as const),
              observacao: override.obs || 'Status atualizado manualmente pelo auditor.',
              url: override.url || item.url,
            };
          }
          return item;
        });
        setData(updated);
        setLoading(false);
      })
      .catch(() => {
        setData(report);
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = useCallback(
    async (id: string, status: string, url: string, obs: string) => {
      try {
        await fetch('/api/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status, url, obs }),
        });

        // Update local state
        setData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: status === 'ok' ? ('ok' as const) : ('ausente' as const),
                  observacao: obs || 'Status atualizado manualmente.',
                  url: url || item.url,
                }
              : item
          )
        );
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {/* KPI Cards */}
        <ScoreCards data={data} />

        {/* Essential Alerts */}
        <EssentialAlerts data={data} />

        {/* Dimension Summary */}
        <DimensionSummary data={data} />

        {/* Full Criteria Table */}
        <CriteriaTable data={data} onStatusUpdate={handleStatusUpdate} />

        {/* Methodology */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Metodologia
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-slate-600">
            <p>
              Esta análise foi realizada de forma semi-automatizada. O script original
              utilizou <strong>Playwright</strong> para renderização do portal JavaScript (SPA)
              e verificou a presença de termos-chave para cada critério PNTP 2026.
            </p>
            <p>
              A versão atual consolida os dados previamente coletados e permite atualizações
              manuais pelo auditor via interface web, garantindo rastreabilidade completa.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-700">Portal:</span>{' '}
                <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {PORTAL_URL}
                </a>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-700">Fonte:</span>{' '}
                <a
                  href="https://radardatransparencia.atricon.org.br/pdf/Cartilha-PNTP-2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Cartilha PNTP 2026 — Atricon
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>
          Análise PNTP 2026 — Portal da Transparência de Osasco · Gerado com Next.js
        </p>
      </footer>
    </div>
  );
}
