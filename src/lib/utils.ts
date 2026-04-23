import type { Peso } from '@/data/criterios';

export function calcScore(found: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((found / total) * 10000) / 100;
}

export function scoreColorClass(pct: number): string {
  if (pct >= 75) return 'text-emerald-500';
  if (pct >= 50) return 'text-amber-500';
  return 'text-red-500';
}

export function scoreBgClass(pct: number): string {
  if (pct >= 75) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

export type Rating = 'Diamante' | 'Ouro' | 'Prata' | 'Intermediário' | 'Básico' | 'Inexistente';

export function getRating(score: number): { label: Rating; colorClass: string } {
  if (score >= 95) return { label: 'Diamante', colorClass: 'text-blue-400' };
  if (score >= 85) return { label: 'Ouro', colorClass: 'text-yellow-400' };
  if (score >= 75) return { label: 'Prata', colorClass: 'text-gray-400' };
  if (score >= 50) return { label: 'Intermediário', colorClass: 'text-emerald-500' };
  if (score >= 25) return { label: 'Básico', colorClass: 'text-orange-500' };
  return { label: 'Inexistente', colorClass: 'text-gray-500' };
}

export function pesoLabel(peso: Peso): string {
  const map: Record<Peso, string> = {
    essencial: 'ESSENCIAL',
    obrigatorio: 'OBRIGATÓRIO',
    recomendado: 'RECOMENDADO',
  };
  return map[peso];
}

export function pesoColorClasses(peso: Peso) {
  switch (peso) {
    case 'essencial':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-600' };
    case 'obrigatorio':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-600' };
    case 'recomendado':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-600' };
  }
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export const PORTAL_URL = 'https://transparencia-osasco.smarapd.com.br';
