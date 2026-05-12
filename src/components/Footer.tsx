'use client';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col gap-2 mb-4 md:mb-0">
          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
            © 2026 Transparency Monitoring Commission. All Rights Reserved.
          </span>
        </div>
        <div className="flex gap-6">
          <a className="font-['Public_Sans'] text-xs uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors" href="#">Política de Privacidade</a>
          <a className="font-['Public_Sans'] text-xs uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors" href="#">Termos de Serviço</a>
          <a className="font-['Public_Sans'] text-xs uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors" href="#">Open Data API</a>
          <a className="font-['Public_Sans'] text-xs uppercase tracking-wider text-[#0070D2] hover:text-blue-600 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors" href="#">Portal Institucional</a>
        </div>
      </div>
    </footer>
  );
}
