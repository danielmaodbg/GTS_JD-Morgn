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
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 flex items-center ${
      isScrolled 
        ? 'bg-jd-dark/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl h-16' 
        : 'bg-transparent h-24 border-none shadow-none'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex items-center justify-between">
        {/* Logo Section - 背景完全透明，確保與後方 Hero 圖層融合 */}
        <div 
          className="flex items-center cursor-pointer group select-none bg-transparent" 
          onClick={() => onNavigate(View.HOME)}
        >
          <div className="relative flex items-center justify-center w-10 h-10 mr-3 bg-transparent">
            <i className={`fa-solid ${config.logoIcon} text-jd-gold text-2xl group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]`}></i>
          </div>
          <div className="flex flex-col bg-transparent">
            <span className="text-white font-black text-lg tracking-tighter uppercase leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              {config.logoText.split(' ')[0]}<span className="text-jd-gold">{config.logoText.split(' ')[1] || ''}</span>
            </span>
            <span className="text-[7px] text-jd-gold font-black uppercase mt-1 tracking-[0.2em]">
              Global Trading System
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 bg-transparent">
          {currentUser ? (
            <div className="flex items-center gap-4 bg-transparent">
              <button 
                onClick={handleActionClick}
                className={`px-5 py-2 rounded-lg transition-all active:scale-95 text-sm font-black uppercase tracking-widest leading-none shadow-xl ${
                  isScrolled 
                    ? 'bg-white/5 border border-white/10 hover:border-jd-gold/50 text-white' 
                    : 'bg-black/40 backdrop-blur-md border border-white/20 hover:border-jd-gold text-white shadow-2xl'
                }`}
              >
                {isAdmin ? '管理中心' : '最新市場消息'}
              </button>
              <button 
                onClick={onLogout} 
                className="text-white/40 hover:text-red-500 transition-all active:scale-90 px-2"
                title="登出系統"
              >
                <i className="fa-solid fa-power-off text-lg"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate(View.LOGIN)}
              className={`px-5 py-2 rounded-lg font-black text-sm md:text-base uppercase tracking-widest transition-all active:scale-95 leading-none ${
                isScrolled 
                  ? 'bg-jd-gold text-jd-dark border border-jd-gold shadow-lg' 
                  : 'bg-jd-gold text-jd-dark border border-jd-gold shadow-[0_10px_30px_rgba(251,191,36,0.4)] hover:scale-105'
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