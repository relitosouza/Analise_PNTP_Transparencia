'use client';

import React, { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { RelatorioCriterio } from '@/data/relatorio';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartsTabProps {
  data: RelatorioCriterio[];
}

export default function ChartsTab({ data }: ChartsTabProps) {
  const [history, setHistory] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/scores');
        const json = await res.json();
        if (json.scores && json.scores.length > 0) {
          setHistory(json.scores);
        }
      } catch (err) {
        console.error('Error loading score history:', err);
      }
    }
    loadHistory();
  }, []);

  // 1. Donut Chart - General Overview
  const donutSeries = useMemo(() => {
    const found = data.filter((d) => d.status === 'ok').length;
    const absent = data.length - found;
    return [found, absent];
  }, [data]);

  const donutOptions: ApexCharts.ApexOptions = {
    labels: ['Encontrado', 'Ausente'],
    colors: ['#10b981', '#ef4444'],
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
    },
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
                const total = data.length;
                const found = data.filter((d) => d.status === 'ok').length;
                return `${Math.round((found / total) * 100)}%`;
              },
            },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} itens`,
      },
    },
  };

  // 2. Horizontal Bar Chart - Dimension Ranking
  const dimensionRanking = useMemo(() => {
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));
    return dims
      .map((dim) => {
        const items = data.filter((d) => d.dimensao === dim);
        const ok = items.filter((i) => i.status === 'ok').length;
        return {
          name: dim.replace(/^\d+\.\s*/, ''), // Remove leading numbers
          fullName: dim,
          value: Math.round((ok / items.length) * 100),
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const rankingOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '70%',
      },
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      style: {
        fontSize: '11px',
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: dimensionRanking.map((r) => r.name),
      max: 100,
      labels: {
        style: { colors: '#94a3b8' },
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontWeight: 500 },
      },
    },
    grid: {
      borderColor: '#f1f5f9',
      xaxis: { lines: { show: true } },
    },
  };

  const rankingSeries = [
    {
      name: 'Conformidade',
      data: dimensionRanking.map((r) => r.value),
    },
  ];

  // 3. Stacked Bar Chart - Absent by Weight
  const stackedData = useMemo(() => {
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));
    // Top 10 dimensions with most gaps to keep it readable
    return dims
      .map((dim) => {
        const items = data.filter((d) => d.dimensao === dim && d.status === 'ausente');
        return {
          name: dim.replace(/^\d+\.\s*/, ''),
          essencial: items.filter((i) => i.peso === 'essencial').length,
          obrigatorio: items.filter((i) => i.peso === 'obrigatorio').length,
          recomendado: items.filter((i) => i.peso === 'recomendado').length,
          total: items.length,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data]);

  const stackedSeries = [
    { name: 'Essencial', data: stackedData.map((d) => d.essencial) },
    { name: 'Obrigatório', data: stackedData.map((d) => d.obrigatorio) },
    { name: 'Recomendado', data: stackedData.map((d) => d.recomendado) },
  ];

  const stackedOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      fontFamily: 'inherit',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: stackedData.map((d) => d.name),
      labels: {
        rotate: -45,
        style: { fontSize: '10px' },
      },
    },
    colors: ['#ef4444', '#f59e0b', '#3b82f6'],
    legend: { position: 'top', horizontalAlign: 'right' },
    grid: { borderColor: '#f1f5f9' },
  };

  // 4. Radar Chart - Compliance Profile
  const radarOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar',
      fontFamily: 'inherit',
      toolbar: { show: false },
    },
    xaxis: {
      categories: dimensionRanking.slice(0, 8).map((r) => r.name), // Show top 8 for clarity
      labels: {
        style: { fontSize: '10px', colors: '#64748b' },
      },
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val: number) => `${val}%`,
      },
    },
    colors: ['#6366f1'],
    fill: {
      opacity: 0.3,
    },
    markers: {
      size: 4,
    },
    stroke: {
      width: 2,
    },
  };
  const radarSeries = [
    {
      name: 'Conformidade',
      data: dimensionRanking.slice(0, 8).map((r) => r.value),
    },
  ];

  // 5. Heatmap - Dimension x Weight
  const heatmapData = useMemo(() => {
    const weights: ('essencial' | 'obrigatorio' | 'recomendado')[] = [
      'essencial',
      'obrigatorio',
      'recomendado',
    ];
    // Show all 19 dimensions
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));

    return weights.map((w) => ({
      name: w.charAt(0).toUpperCase() + w.slice(1),
      data: dims.map((dim) => {
        const items = data.filter((d) => d.dimensao === dim && d.peso === w);
        if (items.length === 0) return { x: dim.replace(/^\d+\.\s*/, ''), y: null };
        const ok = items.filter((i) => i.status === 'ok').length;
        return {
          x: dim.replace(/^\d+\.\s*/, ''),
          y: Math.round((ok / items.length) * 100),
        };
      }),
    }));
  }, [data]);

  const heatmapOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'heatmap',
      fontFamily: 'inherit',
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            { from: 0, to: 30, name: 'Crítico', color: '#fee2e2' },
            { from: 31, to: 70, name: 'Médio', color: '#fef3c7' },
            { from: 71, to: 100, name: 'Excelente', color: '#dcfce7' },
          ],
        },
      },
    },
    xaxis: {
      labels: { rotate: -45, style: { fontSize: '9px' } },
    },
  };

  // 6. Line Chart - Evolution
  const lineSeries = useMemo(() => {
    if (history.length > 0) {
      return [
        {
          name: 'Score PNTP',
          data: history.map((h) => h.score),
        },
      ];
    }
    // Fallback narrative for presentation
    return [
      {
        name: 'Score PNTP (Simulado)',
        data: [34, 35, 38, 42, 45, 52, 58, 64, 66],
      },
    ];
  }, [history]);

  const lineOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: 'smooth', width: 4 },
    xaxis: {
      categories: history.length > 0 
        ? history.map(h => new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
        : ['Abr 01', 'Abr 05', 'Abr 10', 'Abr 12', 'Abr 15', 'Abr 18', 'Abr 20', 'Abr 22', 'Hoje'],
      labels: { style: { colors: '#94a3b8' } },
    },
    yaxis: {
      max: 100,
      labels: { style: { colors: '#94a3b8' } },
    },
    colors: ['#3b82f6'],
    grid: { borderColor: '#f1f5f9' },
    markers: { size: 5, strokeWidth: 0, hover: { size: 7 } },
  };

  // 7. Treemap - Absent Gaps
  const treemapData = useMemo(() => {
    const dims = Array.from(new Set(data.map((d) => d.dimensao)));
    return dims
      .map((dim) => {
        const absent = data.filter((d) => d.dimensao === dim && d.status === 'ausente').length;
        return {
          x: dim.replace(/^\d+\.\s*/, ''),
          y: absent,
        };
      })
      .filter((d) => d.y > 0);
  }, [data]);

  const treemapSeries = [{ data: treemapData }];
  const treemapOptions: ApexCharts.ApexOptions = {
    legend: { show: false },
    chart: { type: 'treemap', fontFamily: 'inherit', toolbar: { show: false } },
    colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Visão Geral da Conformidade</h3>
            <p className="text-xs text-slate-500">Proporção de itens encontrados vs. ausentes</p>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <Chart options={donutOptions} series={donutSeries} type="donut" width="100%" height={300} />
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Ranking por Dimensão</h3>
            <p className="text-xs text-slate-500">Percentual de atendimento por categoria</p>
          </div>
          <Chart options={rankingOptions} series={rankingSeries} type="bar" height={450} />
        </div>

        {/* Stacked Bar Chart */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Gaps por Peso</h3>
            <p className="text-xs text-slate-500">Dimensões com mais critérios ausentes (Top 10)</p>
          </div>
          <Chart options={stackedOptions} series={stackedSeries} type="bar" height={350} />
        </div>

        {/* Radar Chart */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Perfil de Transparência</h3>
            <p className="text-xs text-slate-500">Equilíbrio entre as dimensões principais</p>
          </div>
          <Chart options={radarOptions} series={radarSeries} type="radar" height={350} />
        </div>

        {/* Heatmap */}
        <div className="col-span-full rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Matriz de Maturidade</h3>
            <p className="text-xs text-slate-500">Detalhamento de conformidade por dimensão e peso</p>
          </div>
          <Chart options={heatmapOptions} series={heatmapData} type="heatmap" height={400} />
        </div>

        {/* Evolution Chart */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Evolução do Score</h3>
            <p className="text-xs text-slate-500">Histórico de progresso nas atualizações</p>
          </div>
          <Chart options={lineOptions} series={lineSeries} type="line" height={300} />
        </div>

        {/* Treemap */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Treemap de Lacunas</h3>
            <p className="text-xs text-slate-500">Volume de ausências por dimensão</p>
          </div>
          <Chart options={treemapOptions} series={treemapSeries} type="treemap" height={300} />
        </div>
      </div>
    </div>
  );
}
