'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ScoreCards from '@/components/ScoreCards';
import DimensionSummary from '@/components/DimensionSummary';
import EssentialAlerts from '@/components/EssentialAlerts';
import CriteriaTable from '@/components/CriteriaTable';
import ChartsTab from '@/components/ChartsTab';
import { buildRelatorio } from '@/data/relatorio';
import type { RelatorioCriterio } from '@/data/relatorio';
import { PORTAL_URL } from '@/lib/utils';

export default function HomePage() {
  const [data, setData] = useState<RelatorioCriterio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'charts'>('audit');

  useEffect(() => {
    async function loadAllData() {
      try {
        // 1. Build base report with criteria
        const report = buildRelatorio();

        // 2. Fetch results from Python Scraper (if available in public/data)
        const scraperRes = await fetch('/data/relatorio_pntp.json');
        let scraperData = [];
        if (scraperRes.ok) {
          scraperData = await scraperRes.json();
        }

        // 3. Fetch manual updates from API
        const updatesRes = await fetch('/api/updates');
        const updatesJson = await updatesRes.json();
        const manualUpdates = updatesJson.manual_updates || {};

        // 4. Merge Logic (Priority: Manual > Scraper > Base)
        const updated = report.map((item) => {
          // Check for manual override first
          const manual = manualUpdates[item.id];
          if (manual) {
            return {
              ...item,
              status: manual.status === 'ok' ? ('ok' as const) : ('ausente' as const),
              observacao: manual.obs || item.observacao,
              url: manual.url || item.url,
            };
          }

          // Then check if the scraper found it (using mapping logic already in buildRelatorio or here)
          // Note: buildRelatorio already has some mapping, but we can refine here if needed
          return item;
        });

        setData(updated);
      } catch (err) {
        console.error('Error loading data:', err);
        setData(buildRelatorio());
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
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

        {/* Tab Selection */}
        <div className="flex space-x-1 rounded-xl bg-slate-200/50 p-1">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
              activeTab === 'audit'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Painel de Auditoria
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
              activeTab === 'charts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Gráficos & Insights
          </button>
        </div>

        {activeTab === 'audit' ? (
          <>
            {/* Dimension Summary */}
            <DimensionSummary data={data} />

            {/* Full Criteria Table */}
            <CriteriaTable data={data} onStatusUpdate={handleStatusUpdate} />
          </>
        ) : (
          <ChartsTab data={data} />
        )}

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
              e verificou a presença de termos-chave para cada critério do Programa Nacional de Transparência Pública 2026.
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
          Análise — Programa Nacional de Transparência Pública 2026 — Portal da Transparência de Osasco · Gerado com Next.js
        </p>
      </footer>
    </div>
  );
}
