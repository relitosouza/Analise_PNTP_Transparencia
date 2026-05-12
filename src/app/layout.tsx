import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  weight: ['400', '500', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Monitoramento da Transparência — PNTP / ITGP',
  description: 'Visão consolidada das pontuações gerais PNTP e ITGP em tempo real.',
  keywords: ['PNTP', 'ITGP', '2026', 'transparência', 'Osasco', 'TCE-SP', 'Atricon', 'auditoria'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
      </body>
    </html>
  );
}
