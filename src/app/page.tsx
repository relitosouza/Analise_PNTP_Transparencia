'use client';

import { useState, useEffect, useCallback } from 'react';
import ScoreCards from '@/components/ScoreCards';
import ChartsTab from '@/components/ChartsTab';
import EssentialAlerts from '@/components/EssentialAlerts';
import DimensionSummary from '@/components/DimensionSummary';
import CriteriaTable from '@/components/CriteriaTable';
import { buildRelatorio } from '@/data/relatorio';
import { buildRelatorioITGP } from '@/data/itgp_relatorio';
import { PORTAL_URL } from '@/lib/utils';

import type { RelatorioCriterio } from '@/data/relatorio';

export default function HomePage() {
  const [pntpData, setPntpData] = useState<RelatorioCriterio[]>([]);
  const [itgpData, setItgpData] = useState<RelatorioCriterio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pntp' | 'itgp' | 'charts'>('pntp');

  useEffect(() => {
    async function loadAllData() {
      try {
        const report = buildRelatorio();
        const updatesRes = await fetch('/api/updates');
        const updatesJson = await updatesRes.json();
        const manualUpdates = updatesJson.manual_updates || {};

        const updated = report.map((item) => {
          const manual = manualUpdates[item.id];
          if (manual) {
            return {
              ...item,
              status: manual.status === 'ok' ? ('ok' as const) : ('ausente' as const),
              observacao: manual.obs || item.observacao,
              url: manual.url || item.url,
            };
          }
          return item;
        });

        const itgpReport = buildRelatorioITGP();
        const itgpUpdated = itgpReport.map((item) => {
          const manual = manualUpdates[item.id];
          if (manual) {
            return {
              ...item,
              status: manual.status === 'ok' ? ('ok' as const) : ('ausente' as const),
              observacao: manual.obs || item.observacao,
              url: manual.url || item.url,
            };
          }
          return item;
        });
        
        setItgpData(itgpUpdated);
        setPntpData(updated);
      } catch (err) {
        console.error('Error loading data:', err);
        setPntpData(buildRelatorio());
        setItgpData(buildRelatorioITGP());
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

        if (activeTab === 'pntp') {
          setPntpData((prev) =>
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
        } else if (activeTab === 'itgp') {
          setItgpData((prev) =>
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
        }
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    },
    [activeTab]
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 'itgp' ? itgpData : pntpData;

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Painel de Resumo Institucional</h2>
        <p className="text-slate-500">Visão consolidada das pontuações gerais PNTP e ITGP em tempo real.</p>
      </header>

      <main className="mx-auto max-w-7xl space-y-6">
        {/* KPI Cards */}
        <ScoreCards data={currentData} />

        {/* Essential Alerts */}
        <EssentialAlerts data={currentData} />

        {/* Tab Selection */}
        <div className="flex space-x-1 rounded-xl bg-slate-200/50 p-1">
          <button
            onClick={() => setActiveTab('pntp')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
              activeTab === 'pntp'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-sm">assignment</span>
            Painel PNTP
          </button>
          <button
            onClick={() => setActiveTab('itgp')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
              activeTab === 'itgp'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-sm">security</span>
            Painel ITGP
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
              activeTab === 'charts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-sm">analytics</span>
            Gráficos & Insights
          </button>
        </div>

        {activeTab === 'pntp' || activeTab === 'itgp' ? (
          <>
            <DimensionSummary data={currentData} />
            <CriteriaTable 
              data={currentData} 
              onStatusUpdate={handleStatusUpdate} 
            />
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <ChartsTab pntpData={pntpData} itgpData={itgpData} />
          </div>
        )}

        {/* Methodology */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
             <span className="material-symbols-outlined text-blue-500">menu_book</span>
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

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>
          Programa Nacional de Transparência Pública Osasco 2026 — Portal da Transparência · Gerado com Next.js
        </p>
      </footer>
    </div>
  );
}
