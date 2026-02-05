import React from 'react';
import { View, User, AppConfig, Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentUser: User | null;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isScrolled: boolean;
  config: AppConfig;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onNavigate, onLogout, isScrolled, config, language, setLanguage }) => {
  const ADMIN_EMAIL = "info@jdmorgan.ca";
  const t = translations[language];

  const isAdmin = currentUser && (
    currentUser.role?.toLowerCase() === 'admin' || 
    currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    currentUser.username?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  const handleActionClick = () => {
    if (!currentUser) return;
    
    if (isAdmin) {
      onNavigate(View.ADMIN);
    } else {
      onNavigate(View.NEWS);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 flex items-center ${
      isScrolled 
        ? 'bg-jd-dark/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl h-16' 
        : 'bg-transparent h-24 border-none'
    }`}>
      <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full flex items-center justify-between">
        {/* Logo Section - With Enhanced Regional Sub-Links */}
        <div className="flex items-center cursor-pointer group select-none bg-transparent">
          <div 
            className="relative flex items-center justify-center w-12 h-12 mr-4 shrink-0"
            onClick={() => onNavigate(View.HOME)}
          >
            <div className={`absolute inset-0 bg-jd-gold/10 rounded-full blur-2xl transition-all duration-1000 ${isScrolled ? 'opacity-0' : 'opacity-100 animate-pulse'}`}></div>
            <i className={`fa-solid ${config.logoIcon} text-jd-gold text-3xl relative z-10 group-hover:rotate-[360deg] transition-all duration-1000 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]`}></i>
          </div>
          <div className="flex flex-col bg-transparent">
            <span 
              className="text-white font-black text-2xl tracking-tighter uppercase leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              onClick={() => onNavigate(View.HOME)}
            >
              JD<span className="text-jd-gold">MORGAN</span>
            </span>
            
            {/* Regional Links Container with Border Box */}
            <div className="flex items-center gap-1.5 mt-2.5 p-1 px-2 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
              <a 
                href="https://gts-jd-morgn.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-jd-gold transition-all font-black uppercase tracking-[0.1em] whitespace-nowrap"
              >
                <i className="fa-solid fa-arrow-right text-[11px] text-jd-gold/60"></i>
                {(t as any).nav_north_america}
              </a>
              <span className="w-px h-2.5 bg-white/10 mx-0.5"></span>
              <a 
                href="https://jdmorgan.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-jd-gold transition-all font-black uppercase tracking-[0.1em] whitespace-nowrap"
              >
                <i className="fa-solid fa-arrow-right text-[11px] text-jd-gold/60"></i>
                {(t as any).nav_asia_pacific}
              </a>
            </div>
          </div>
        </div>

        {/* Navigation & Language Switch Section */}
        <div className="flex items-center space-x-10 bg-transparent">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(Language.EN)}
              className={`font-black text-[10px] uppercase tracking-widest transition-all ${language === Language.EN ? 'text-jd-gold' : 'text-white/30 hover:text-white'}`}
            >
              EN
            </button>
            <span className="w-px h-2.5 bg-white/20"></span>
            <button 
              onClick={() => setLanguage(Language.ZH)}
              className={`font-black text-[10px] uppercase tracking-widest transition-all ${language === Language.ZH ? 'text-jd-gold' : 'text-white/30 hover:text-white'}`}
            >
              中
            </button>
            <i className="fa-solid fa-globe text-white/20 text-[10px] ml-1"></i>
          </div>

          {/* User Management State */}
          {currentUser ? (
            <div className="flex items-center gap-6 border-l border-white/10 pl-8">
              <button 
                onClick={handleActionClick}
                className={`px-6 py-2 rounded-xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest leading-none shadow-xl ${
                  isScrolled 
                    ? 'bg-white/5 border border-white/10 hover:border-jd-gold/50 text-white hover:bg-white/10' 
                    : 'bg-black/20 backdrop-blur-md border border-white/10 hover:border-jd-gold text-white hover:bg-black/40'
                }`}
              >
                {isAdmin ? t.nav_admin : t.nav_market}
              </button>
              <button 
                onClick={onLogout} 
                className="text-white/20 hover:text-red-500 transition-all active:scale-90"
                title="登出系統"
              >
                <i className="fa-solid fa-power-off text-lg"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate(View.LOGIN)}
              className="text-jd-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;