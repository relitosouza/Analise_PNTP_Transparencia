'use client';

import { useState, useEffect } from 'react';
import ScoreCards from '@/components/ScoreCards';
import ChartsTab from '@/components/ChartsTab';
import { buildRelatorio } from '@/data/relatorio';
import type { RelatorioCriterio } from '@/data/relatorio';

export default function HomePage() {
  const [data, setData] = useState<RelatorioCriterio[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Painel de Resumo Institucional</h2>
        <p className="text-slate-500">Visão consolidada das pontuações gerais PNTP e ITGP em tempo real.</p>
      </header>

      {/* KPI Cards */}
      <ScoreCards data={data} />

      {/* Charts & Insights as main dashboard content */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">analytics</span>
          Análise de Evolução e Dimensões
        </h3>
        <ChartsTab data={data} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container p-6 rounded-xl">
          <h4 className="text-sm font-bold text-primary mb-2">Dica de Auditoria</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            A tendência atual sugere um foco nos critérios essenciais de Saúde e Educação para atingir o nível Ouro no PNTP 2026.
          </p>
        </div>
        <div className="bg-secondary/5 p-6 rounded-xl border border-secondary/10">
          <h4 className="text-sm font-bold text-secondary mb-2">Status do Portal</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            O portal da transparência de Osasco encontra-se atualmente com 100 critérios mapeados, sendo 42 marcados como não-conformes.
          </p>
        </div>
      </div>
    </div>
  );
}
