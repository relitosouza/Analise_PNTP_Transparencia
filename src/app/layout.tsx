import type { Metadata } from 'next';
<<<<<<< HEAD
import { Public_Sans } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  weight: ['400', '500', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Monitoramento da Transparência — PNTP / ITGP Osasco 2026',
  description: 'Visão consolidada das pontuações gerais PNTP e ITGP em tempo real para o município de Osasco.',
=======
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Programa Nacional de Transparência Pública Osasco 2026',
  description: 'Comparativo entre os critérios da Cartilha PNTP e ITGP para o Portal da Transparência de Osasco.',
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
  keywords: ['PNTP', 'ITGP', '2026', 'transparência', 'Osasco', 'TCE-SP', 'Atricon', 'auditoria'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="pt-BR" className={publicSans.variable}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body className="min-h-screen bg-background font-body-md antialiased text-on-background">
        <ClientLayout>
          {children}
        </ClientLayout>
=======
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        {children}
>>>>>>> 212df8707af6f97e13a5cdd17d9a045e38a2bdde
      </body>
    </html>
  );
}
