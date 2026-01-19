import React from 'react';
import { View, User, AppConfig } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isScrolled: boolean;
  config: AppConfig;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onNavigate, onLogout, isScrolled, config }) => {
  const ADMIN_EMAIL = "info@jdmorgan.ca";

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
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-1000 flex items-center ${
      isScrolled 
        ? 'bg-jd-dark/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl h-16' 
        : 'bg-transparent h-28 border-none'
    }`}>
      <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full flex items-center justify-between">
        {/* Logo Section - Seamless integration with Hero background */}
        <div 
          className="flex items-center cursor-pointer group select-none bg-transparent" 
          onClick={() => onNavigate(View.HOME)}
        >
          <div className="relative flex items-center justify-center w-12 h-12 mr-4">
            <div className={`absolute inset-0 bg-jd-gold/10 rounded-full blur-2xl transition-all duration-1000 ${isScrolled ? 'opacity-0' : 'opacity-100 animate-pulse'}`}></div>
            <i className={`fa-solid ${config.logoIcon} text-jd-gold text-3xl relative z-10 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]`}></i>
          </div>
          <div className="flex flex-col bg-transparent">
            <span className="text-white font-black text-2xl tracking-tighter uppercase leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {config.logoText.split(' ')[0]}<span className="text-jd-gold">{config.logoText.split(' ')[1] || ''}</span>
            </span>
            <span className="text-[8px] text-jd-gold/80 font-black uppercase mt-1 tracking-[0.4em] drop-shadow-sm">
              Global Trading System
            </span>
          </div>
        </div>

        {/* Navigation & Language Switch Section */}
        <div className="flex items-center space-x-10 bg-transparent">
          {/* Professional Language Switcher */}
          <button className="flex items-center gap-2 group">
            <span className="text-jd-gold font-black text-[10px] uppercase tracking-widest transition-colors group-hover:text-white">EN</span>
            <span className="w-px h-2.5 bg-white/20"></span>
            <span className="text-white/40 font-black text-[10px] uppercase tracking-widest transition-colors group-hover:text-jd-gold">中</span>
            <i className="fa-solid fa-globe text-white/20 text-[10px] ml-1 group-hover:text-jd-gold group-hover:rotate-12 transition-all"></i>
          </button>

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
                {isAdmin ? '管理中心' : '市場觀察'}
              </button>
              <button 
                onClick={onLogout} 
                className="text-white/20 hover:text-red-500 transition-all active:scale-90"
                title="登出系統"
              >
                <i className="fa-solid fa-power-off text-lg"></i>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;