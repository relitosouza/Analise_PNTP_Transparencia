'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const menuItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/' },
  { label: 'Auditoria PNTP', icon: 'assignment_turned_in', href: '/pntp' },
  { label: 'Avaliação ITGP', icon: 'verified', href: '/itgp' },
  { label: 'Relatórios', icon: 'analytics', href: '#reports' },
];

const footerItems = [
  { label: 'Configurações', icon: 'settings', href: '#settings' },
  { label: 'Suporte', icon: 'contact_support', href: '#support' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="fixed left-0 top-0 flex flex-col h-screen border-r bg-[#F8FAFC] dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-['Public_Sans'] text-sm font-medium z-50 overflow-y-auto overflow-x-hidden"
    >
      <div className={`p-6 flex flex-col items-center gap-4 border-b border-slate-200 dark:border-slate-800 relative`}>
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-50"
        >
          <span className="material-symbols-outlined text-xs">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>

        <motion.div 
          animate={{ scale: isCollapsed ? 0.6 : 1 }}
          className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-sm shrink-0"
        >
          <img 
            alt="Institutional Seal" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuArNvScWpPsp3MWMT6A1LuccHzjD-neReyceDjOQWM6T__RR3-XrgCqiV_OeI-bRRUEFio0lP7yD5UTMsUZLCeVI6POIhHWAsway7MlinjsSPX1v0klbqAAj_gMhKIzRu45I0d07Fp5md97fkD91WvT_LUFGy4JjkCexI5fIxryRqsKTANjW3oLk_mqVEu5K7cevq9mEZGPGWL50WdiPHfQlmHNM7fngI777zDWb1ZR_MCBZnttkGuh-6QfodDS290TFqCKPKiRsriJ"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
          <h1 className="text-blue-900 dark:text-blue-100 font-bold text-base truncate">Monitoramento da Transparência</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">PNTP / ITGP Portal</p>
          </motion.div>
        )}
      </div>

      <nav className="mt-6 flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                isActive 
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 px-3 space-y-1">
        {footerItems.map((item) => (
          <Link 
            key={item.label}
            href={item.href}
            title={isCollapsed ? item.label : undefined}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
          >
            <span className="material-symbols-outlined shrink-0">{item.icon}</span>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate"
              >
                {item.label}
              </motion.span>
            )}
          </Link>
        ))}
      </div>
    </motion.aside>
  );
}
