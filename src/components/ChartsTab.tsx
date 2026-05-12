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
  data: RelatorioCriterio[];
}

// ─── shared helpers ──────────────────────────────────────────────────────────

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

// ─── PNTP charts ─────────────────────────────────────────────────────────────

function PNTPCharts({ data, history }: { data: RelatorioCriterio[]; history: { date: string; score: number }[] }) {
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

  const stackedData = useMemo(() => {
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));
    return dims
      .map((dim) => {
        const absent = data.filter((d) => d.dimensao === dim && d.status === 'ausente');
        return {
          name: dim.replace(/^\d+\.\s*/, ''),
          essencial: absent.filter((i) => i.peso === 'essencial').length,
          obrigatorio: absent.filter((i) => i.peso === 'obrigatorio').length,
          recomendado: absent.filter((i) => i.peso === 'recomendado').length,
          total: absent.length,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data]);

  const stackedOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', stacked: true, fontFamily: 'inherit', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 4 } },
    xaxis: { categories: stackedData.map((d) => d.name), labels: { rotate: -45, style: { fontSize: '10px' } } },
    colors: ['#ef4444', '#f59e0b', '#3b82f6'],
    legend: { position: 'top', horizontalAlign: 'right' },
    grid: { borderColor: '#f1f5f9' },
  };

  const radarOptions: ApexCharts.ApexOptions = {
    chart: { type: 'radar', fontFamily: 'inherit', toolbar: { show: false } },
    xaxis: { categories: dimensionRanking.slice(0, 8).map((r) => r.name), labels: { style: { fontSize: '10px', colors: '#64748b' } } },
    yaxis: { max: 100, tickAmount: 5, labels: { formatter: (v: number) => `${v}%` } },
    colors: ['#6366f1'],
    fill: { opacity: 0.3 },
    markers: { size: 4 },
    stroke: { width: 2 },
  };

  const heatmapData = useMemo(() => {
    const weights: ('essencial' | 'obrigatorio' | 'recomendado')[] = ['essencial', 'obrigatorio', 'recomendado'];
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));
    return weights.map((w) => ({
      name: w.charAt(0).toUpperCase() + w.slice(1),
      data: dims.map((dim) => {
        const items = data.filter((d) => d.dimensao === dim && d.peso === w);
        if (items.length === 0) return { x: dim.replace(/^\d+\.\s*/, ''), y: null };
        const ok = items.filter((i) => i.status === 'ok').length;
        return { x: dim.replace(/^\d+\.\s*/, ''), y: Math.round((ok / items.length) * 100) };
      }),
    }));
  }, [data]);

  const heatmapOptions: ApexCharts.ApexOptions = {
    chart: { type: 'heatmap', fontFamily: 'inherit', toolbar: { show: false } },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5, radius: 4, useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            { from: 0, to: 30, name: 'Crítico', color: '#fee2e2' },
            { from: 31, to: 70, name: 'Médio', color: '#fef3c7' },
            { from: 71, to: 100, name: 'Excelente', color: '#dcfce7' },
          ],
        },
      },
    },
    xaxis: { labels: { rotate: -45, style: { fontSize: '9px' } } },
  };

  const lineSeries = useMemo(() => {
    if (history.length > 0) return [{ name: 'Score PNTP', data: history.map((h) => h.score) }];
    return [{ name: 'Score PNTP (Simulado)', data: [34, 35, 38, 42, 45, 52, 58, 64, 66] }];
  }, [history]);

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
    colors: ['#3b82f6'],
    grid: { borderColor: '#f1f5f9' },
    markers: { size: 5, strokeWidth: 0, hover: { size: 7 } },
  };

  const treemapData = useMemo(() => {
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));
    return dims
      .map((dim) => ({ x: dim.replace(/^\d+\.\s*/, ''), y: data.filter((d) => d.dimensao === dim && d.status === 'ausente').length }))
      .filter((d) => d.y > 0);
  }, [data]);

  const treemapOptions: ApexCharts.ApexOptions = {
    legend: { show: false },
    chart: { type: 'treemap', fontFamily: 'inherit', toolbar: { show: false } },
    colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
    plotOptions: { treemap: { distributed: true, enableShades: false } },
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Visão Geral — PNTP" subtitle="Proporção de itens encontrados vs. ausentes">
        <div className="flex items-center justify-center">
          <Chart options={donutOptions} series={donutSeries} type="donut" width="100%" height={300} />
        </div>
      </ChartCard>

      <ChartCard title="Ranking por Dimensão" subtitle="Percentual de atendimento por categoria">
        <Chart options={rankingOptions} series={[{ name: 'Conformidade', data: dimensionRanking.map((r) => r.value) }]} type="bar" height={450} />
      </ChartCard>

      <ChartCard title="Gaps por Peso" subtitle="Dimensões com mais critérios ausentes (Top 10)">
        <Chart options={stackedOptions} series={[
          { name: 'Essencial', data: stackedData.map((d) => d.essencial) },
          { name: 'Obrigatório', data: stackedData.map((d) => d.obrigatorio) },
          { name: 'Recomendado', data: stackedData.map((d) => d.recomendado) },
        ]} type="bar" height={350} />
      </ChartCard>

      <ChartCard title="Perfil de Transparência" subtitle="Equilíbrio entre as dimensões principais (Top 8)">
        <Chart options={radarOptions} series={[{ name: 'Conformidade', data: dimensionRanking.slice(0, 8).map((r) => r.value) }]} type="radar" height={350} />
      </ChartCard>

      <ChartCard title="Matriz de Maturidade" subtitle="Conformidade por dimensão e peso" fullWidth>
        <Chart options={heatmapOptions} series={heatmapData} type="heatmap" height={400} />
      </ChartCard>

      <ChartCard title="Evolução do Score" subtitle="Histórico de progresso nas atualizações">
        <Chart options={lineOptions} series={lineSeries} type="line" height={300} />
      </ChartCard>

      <ChartCard title="Treemap de Lacunas" subtitle="Volume de ausências por dimensão">
        <Chart options={treemapOptions} series={[{ data: treemapData }]} type="treemap" height={300} />
      </ChartCard>
    </div>
  );
}

// ─── ITGP charts ─────────────────────────────────────────────────────────────

function ITGPCharts({ respostas }: { respostas: Record<string, ITGPResposta> }) {
  const pontuacao = useMemo(() => calcularPontuacaoITGP(respostas), [respostas]);

  const totalPerguntas = itgpPerguntas.length;
  const sim = itgpPerguntas.filter((p) => respostas[p.id]?.status === 'sim').length;
  const parcial = itgpPerguntas.filter((p) => respostas[p.id]?.status === 'parcial').length;
  const nao = itgpPerguntas.filter((p) => respostas[p.id]?.status === 'nao').length;
  const naoAvaliado = totalPerguntas - sim - parcial - nao;

  // 1. Donut — respostas
  const donutOptions: ApexCharts.ApexOptions = {
    labels: ['Sim', 'Parcial', 'Não', 'Não avaliado'],
    colors: ['#10b981', '#f59e0b', '#ef4444', '#cbd5e1'],
    chart: { type: 'donut', fontFamily: 'inherit' },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Pontuação',
              color: '#64748b',
              formatter: () => `${pontuacao.percentual}%`,
            },
          },
        },
      },
    },
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
    stroke: { show: false },
    tooltip: { y: { formatter: (v: number) => `${v} perguntas` } },
  };

  // 2. Bar — score % per dimension
  const dimRanking = useMemo(() => {
    return Object.entries(pontuacao.porDimensao)
      .map(([dim, d]) => ({ name: dim.replace(/^\d+\.\s*/, ''), value: d.percentual }))
      .sort((a, b) => b.value - a.value);
  }, [pontuacao]);

  const barOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', fontFamily: 'inherit', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '65%' } },
    colors: ['#8b5cf6'],
    dataLabels: { enabled: true, formatter: (v: number) => `${v}%`, style: { fontSize: '11px', fontWeight: 600 } },
    xaxis: { categories: dimRanking.map((r) => r.name), max: 100, labels: { style: { colors: '#94a3b8' } } },
    yaxis: { labels: { style: { colors: '#64748b', fontWeight: 500 } } },
    grid: { borderColor: '#f1f5f9', xaxis: { lines: { show: true } } },
  };

  // 3. Stacked bar — Sim/Parcial/Não per dimension
  const stackedDims = useMemo(() => {
    const dims = Array.from(new Set(itgpPerguntas.map((p) => p.dimensao)));
    return dims.map((dim) => {
      const qs = itgpPerguntas.filter((p) => p.dimensao === dim);
      return {
        name: dim.replace(/^\d+\.\s*/, ''),
        sim: qs.filter((p) => respostas[p.id]?.status === 'sim').length,
        parcial: qs.filter((p) => respostas[p.id]?.status === 'parcial').length,
        nao: qs.filter((p) => respostas[p.id]?.status === 'nao').length,
        naoAv: qs.filter((p) => !respostas[p.id] || respostas[p.id]?.status === 'nao_avaliado').length,
      };
    });
  }, [respostas]);

  const stackedOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', stacked: true, fontFamily: 'inherit', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
    xaxis: { categories: stackedDims.map((d) => d.name), labels: { rotate: -40, style: { fontSize: '10px' } } },
    colors: ['#10b981', '#f59e0b', '#ef4444', '#e2e8f0'],
    legend: { position: 'top', horizontalAlign: 'right' },
    grid: { borderColor: '#f1f5f9' },
    tooltip: { y: { formatter: (v: number) => `${v} perguntas` } },
  };

  // 4. Radar — score % per dimension
  const radarDims = dimRanking.slice(0, 7);
  const radarOptions: ApexCharts.ApexOptions = {
    chart: { type: 'radar', fontFamily: 'inherit', toolbar: { show: false } },
    xaxis: { categories: radarDims.map((r) => r.name), labels: { style: { fontSize: '10px', colors: '#64748b' } } },
    yaxis: { max: 100, tickAmount: 5, labels: { formatter: (v: number) => `${v}%` } },
    colors: ['#8b5cf6'],
    fill: { opacity: 0.3 },
    markers: { size: 4 },
    stroke: { width: 2 },
  };

  // 5. Treemap — peso 2 questions not answered "sim"
  const treemapData = useMemo(() => {
    const dims = Array.from(new Set(itgpPerguntas.map((p) => p.dimensao)));
    return dims
      .map((dim) => {
        const gap = itgpPerguntas
          .filter((p) => p.dimensao === dim)
          .filter((p) => respostas[p.id]?.status !== 'sim')
          .reduce((acc, p) => acc + p.peso, 0);
        return { x: dim.replace(/^\d+\.\s*/, ''), y: gap };
      })
      .filter((d) => d.y > 0);
  }, [respostas]);

  const treemapOptions: ApexCharts.ApexOptions = {
    legend: { show: false },
    chart: { type: 'treemap', fontFamily: 'inherit', toolbar: { show: false } },
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9'],
    plotOptions: { treemap: { distributed: true, enableShades: false } },
    tooltip: { y: { formatter: (v: number) => `${v} pts de lacuna` } },
  };

  const hasData = sim + parcial + nao > 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {!hasData && (
        <div className="col-span-full rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-700">
          Nenhuma pergunta avaliada ainda. Acesse a aba <strong>ITGP</strong> para preencher o questionário e os gráficos serão gerados automaticamente.
        </div>
      )}

      <ChartCard title="Visão Geral — ITGP" subtitle="Distribuição das respostas por status">
        <div className="flex items-center justify-center">
          <Chart options={donutOptions} series={[sim, parcial, nao, naoAvaliado]} type="donut" width="100%" height={300} />
        </div>
      </ChartCard>

      <ChartCard title="Pontuação por Dimensão" subtitle="Percentual atingido em cada dimensão">
        <Chart options={barOptions} series={[{ name: 'Pontuação', data: dimRanking.map((r) => r.value) }]} type="bar" height={380} />
      </ChartCard>

      <ChartCard title="Respostas por Dimensão" subtitle="Distribuição de Sim / Parcial / Não / Não avaliado" fullWidth>
        <Chart options={stackedOptions} series={[
          { name: 'Sim', data: stackedDims.map((d) => d.sim) },
          { name: 'Parcial', data: stackedDims.map((d) => d.parcial) },
          { name: 'Não', data: stackedDims.map((d) => d.nao) },
          { name: 'Não avaliado', data: stackedDims.map((d) => d.naoAv) },
        ]} type="bar" height={320} />
      </ChartCard>

      <ChartCard title="Perfil ITGP" subtitle="Equilíbrio entre as dimensões (Top 7)">
        <Chart options={radarOptions} series={[{ name: 'Pontuação', data: radarDims.map((r) => r.value) }]} type="radar" height={350} />
      </ChartCard>

      <ChartCard title="Mapa de Lacunas ITGP" subtitle="Pontuação total não atingida por dimensão (ponderada pelo peso)">
        {treemapData.length > 0 ? (
          <Chart options={treemapOptions} series={[{ data: treemapData }]} type="treemap" height={300} />
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-slate-400">
            Sem lacunas detectadas
          </div>
        )}
      </ChartCard>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ChartsTab({ data }: ChartsTabProps) {
  const [history, setHistory] = useState<{ date: string; score: number }[]>([]);
  const [itgpRespostas, setItgpRespostas] = useState<Record<string, ITGPResposta>>({});

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

    try {
      const stored = localStorage.getItem(ITGP_STORAGE_KEY);
      if (stored) setItgpRespostas(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* PNTP section */}
      <SectionHeader
        title="PNTP 2026 — Programa Nacional de Transparência Pública"
        subtitle="Atricon / TCE-SP · Avaliação automatizada + revisão manual"
        color="border-blue-200 bg-blue-50"
      />
      <PNTPCharts data={data} history={history} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">segunda fonte</span>
        </div>
      </div>

      {/* ITGP section */}
      <SectionHeader
        title="ITGP — Índice de Transparência e Governança Pública"
        subtitle="Transparência Internacional Brasil · 3ª edição · Avaliação manual"
        color="border-purple-200 bg-purple-50"
      />
      <ITGPCharts respostas={itgpRespostas} />
    </div>
  );
}
