'use client';

export default function Header() {
  return (
    <header className="flex justify-between items-center h-16 px-6 w-full bg-white dark:bg-slate-900 sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 shadow-sm font-['Public_Sans'] antialiased">
      <div className="flex items-center gap-8">
        <span className="text-lg font-black tracking-tight text-[#003366] dark:text-blue-200 uppercase">Monitoramento da Transparência</span>
        <div className="relative w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text"
            className="w-full pl-10 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" 
            placeholder="Buscar entidades ou processos..." 
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer rounded-full relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer rounded-full">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
      </div>
    </header>
  );
}
