'use client';

import React, { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { RelatorioCriterio } from '@/data/relatorio';
import {
  itgpPerguntas,
  calcularPontuacaoITGP,
  ITGP_STORAGE_KEY,
  type ITGPResposta,
} from '@/data/itgp';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartsTabProps {
  pntpData: RelatorioCriterio[];
  itgpData: RelatorioCriterio[];
}

function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border ${color} px-5 py-4`}>
      <div className="flex-1">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, fullWidth = false }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default function ChartsTab({ pntpData, itgpData }: ChartsTabProps) {
  const [history, setHistory] = useState<{ date: string; score: number }[]>([]);
  const [dataSource, setDataSource] = useState<'pntp' | 'itgp'>('pntp');

  const data = dataSource === 'pntp' ? pntpData : itgpData;

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/scores');
        const json = await res.json();
        if (json.scores?.length > 0) setHistory(json.scores);
      } catch {
        // ignore
      }
    }
    loadHistory();
  }, []);

  // PNTP Helpers
  const donutSeries = useMemo(() => {
    const found = data.filter((d) => d.status === 'ok').length;
    return [found, data.length - found];
  }, [data]);

  const donutOptions: ApexCharts.ApexOptions = {
    labels: ['Encontrado', 'Ausente'],
    colors: ['#10b981', '#ef4444'],
    chart: { type: 'donut', fontFamily: 'inherit' },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Conformidade',
              color: '#64748b',
              formatter: () => {
                const found = data.filter((d) => d.status === 'ok').length;
                return `${Math.round((found / data.length) * 100)}%`;
              },
            },
          },
        },
      },
    },
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
    stroke: { show: false },
    tooltip: { y: { formatter: (v: number) => `${v} itens` } },
  };

  const dimensionRanking = useMemo(() => {
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));
    return dims
      .map((dim) => {
        const items = data.filter((d) => d.dimensao === dim);
        const ok = items.filter((i) => i.status === 'ok').length;
        return { name: dim.replace(/^\d+\.\s*/, ''), value: Math.round((ok / items.length) * 100) };
      })
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const rankingOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', fontFamily: 'inherit', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '70%' } },
    colors: ['#3b82f6'],
    dataLabels: { enabled: true, formatter: (v: number) => `${v}%`, style: { fontSize: '11px', fontWeight: 600 } },
    xaxis: { categories: dimensionRanking.map((r) => r.name), max: 100, labels: { style: { colors: '#94a3b8' } } },
    yaxis: { labels: { style: { colors: '#64748b', fontWeight: 500 } } },
    grid: { borderColor: '#f1f5f9', xaxis: { lines: { show: true } } },
  };

  const lineSeries = useMemo(() => {
    if (dataSource === 'pntp' && history.length > 0) {
      return [
        {
          name: 'Score PNTP',
          data: history.map((h) => h.score),
        },
      ];
    }
    return [
      {
        name: `Score ${dataSource.toUpperCase()} (Simulado)`,
        data: dataSource === 'pntp' 
          ? [34, 35, 38, 42, 45, 52, 58, 64, 66]
          : [0, 5, 10, 15, 20, 25, 30, 35, 40],
      },
    ];
  }, [history, dataSource]);

  const lineOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line', fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 4 },
    xaxis: {
      categories: history.length > 0
        ? history.map((h) => new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
        : ['Abr 01', 'Abr 05', 'Abr 10', 'Abr 12', 'Abr 15', 'Abr 18', 'Abr 20', 'Abr 22', 'Hoje'],
      labels: { style: { colors: '#94a3b8' } },
    },
    yaxis: { max: 100, labels: { style: { colors: '#94a3b8' } } },
    colors: [dataSource === 'pntp' ? '#3b82f6' : '#8b5cf6'],
    grid: { borderColor: '#f1f5f9' },
    markers: { size: 5, strokeWidth: 0, hover: { size: 7 } },
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-slate-200/50 p-1">
          <button
            onClick={() => setDataSource('pntp')}
            className={`rounded-md px-6 py-1.5 text-sm font-bold transition-all ${
              dataSource === 'pntp'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Dados PNTP
          </button>
          <button
            onClick={() => setDataSource('itgp')}
            className={`rounded-md px-6 py-1.5 text-sm font-bold transition-all ${
              dataSource === 'itgp'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Dados ITGP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Visão Geral da Conformidade" subtitle="Proporção de itens encontrados vs. ausentes">
          <div className="flex flex-1 items-center justify-center">
            <Chart options={donutOptions} series={donutSeries} type="donut" width="100%" height={300} />
          </div>
        </ChartCard>

        <ChartCard title="Ranking por Dimensão" subtitle="Percentual de atendimento por categoria">
          <Chart options={rankingOptions} series={[{ name: 'Conformidade', data: dimensionRanking.map((r) => r.value) }]} type="bar" height={450} />
        </ChartCard>

        <ChartCard title="Evolução do Score" subtitle="Histórico de progresso nas atualizações" fullWidth>
          <Chart options={lineOptions} series={lineSeries} type="line" height={300} />
        </ChartCard>
      </div>
    </div>
  );
}
