'use client';

import { PORTAL_URL } from '@/lib/utils';

export default function Header() {
  const now = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d2b4e] to-[#1a5276]">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-300 ring-1 ring-emerald-500/30">
                PNTP 2026
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Análise PNTP 2026 — Portal da Transparência
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-blue-200/80">
              Comparativo entre os critérios da Cartilha PNTP 2026 (Atricon/TCE-SP) e as informações
              disponíveis em{' '}
              <a
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-300 underline decoration-blue-400/40 underline-offset-2 transition-colors hover:text-white"
              >
                {PORTAL_URL}
              </a>
            </p>
          </div>

          <div className="hidden shrink-0 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-right backdrop-blur-sm sm:block">
            <p className="text-[11px] uppercase tracking-widest text-blue-300/60">Gerado em</p>
            <p className="mt-0.5 text-sm font-semibold text-white">{now}</p>
            <p className="mt-2 text-[11px] uppercase tracking-widest text-blue-300/60">Município</p>
            <p className="mt-0.5 text-sm font-semibold text-white">Osasco — SP</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500" />
    </header>
  );
}
