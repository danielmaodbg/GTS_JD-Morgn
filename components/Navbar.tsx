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
        ? 'bg-jd-dark/90 backdrop-blur-3xl border-b border-white/5 shadow-2xl h-16' 
        : 'bg-transparent h-28 border-none'
    }`}>
      <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full flex items-center justify-between">
        {/* Logo Section - 完全透明設計，與 Hero 圖直接融合 */}
        <div 
          className="flex items-center cursor-pointer group select-none bg-transparent" 
          onClick={() => onNavigate(View.HOME)}
        >
          <div className="relative flex items-center justify-center w-14 h-14 mr-4">
            {/* Logo 呼吸發光感強化融合感 */}
            <div className={`absolute inset-0 bg-jd-gold/10 rounded-full blur-2xl transition-all duration-1000 ${isScrolled ? 'opacity-0' : 'opacity-100 animate-pulse'}`}></div>
            <i className={`fa-solid ${config.logoIcon} text-jd-gold text-4xl relative z-10 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]`}></i>
          </div>
          <div className="flex flex-col bg-transparent">
            <span className="text-white font-black text-3xl tracking-tighter uppercase leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {config.logoText.split(' ')[0]}<span className="text-jd-gold">{config.logoText.split(' ')[1] || ''}</span>
            </span>
            <span className="text-[9px] text-jd-gold/80 font-black uppercase mt-1.5 tracking-[0.4em] drop-shadow-sm">
              Global Trading System
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6 bg-transparent">
          {currentUser ? (
            <div className="flex items-center gap-6">
              <button 
                onClick={handleActionClick}
                className={`px-7 py-3 rounded-xl transition-all active:scale-95 text-[11px] font-black uppercase tracking-widest leading-none shadow-2xl ${
                  isScrolled 
                    ? 'bg-white/5 border border-white/10 hover:border-jd-gold/50 text-white hover:bg-white/10' 
                    : 'bg-black/20 backdrop-blur-md border border-white/10 hover:border-jd-gold text-white hover:bg-black/40'
                }`}
              >
                {isAdmin ? '管理中心' : '最新市場消息'}
              </button>
              <button 
                onClick={onLogout} 
                className="text-white/40 hover:text-red-500 transition-all active:scale-90 px-2"
                title="登出系統"
              >
                <i className="fa-solid fa-power-off text-2xl"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate(View.LOGIN)}
              className={`px-10 py-3.5 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 leading-none ${
                isScrolled 
                  ? 'bg-jd-gold text-jd-dark border border-jd-gold shadow-lg' 
                  : 'bg-jd-gold text-jd-dark border border-jd-gold shadow-[0_15px_40px_rgba(251,191,36,0.3)] hover:scale-105 hover:shadow-[0_20px_60px_rgba(251,191,36,0.5)]'
              }`}
            >
              會員登入
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;