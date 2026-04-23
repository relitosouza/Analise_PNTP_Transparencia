import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Análise PNTP 2026 — Portal da Transparência de Osasco',
  description: 'Comparativo entre os critérios da Cartilha PNTP 2026 (Atricon/TCE-SP) e as informações disponíveis no Portal da Transparência de Osasco.',
  keywords: ['PNTP', '2026', 'transparência', 'Osasco', 'TCE-SP', 'Atricon', 'auditoria'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
