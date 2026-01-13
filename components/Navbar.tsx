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
        ? 'bg-jd-dark/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl h-16' 
        : 'bg-transparent h-28 border-none'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex items-center justify-between">
        {/* Logo Section - 完全透明設計 */}
        <div 
          className="flex items-center cursor-pointer group select-none" 
          onClick={() => onNavigate(View.HOME)}
        >
          <div className="relative flex items-center justify-center w-12 h-12 mr-3">
            <i className={`fa-solid ${config.logoIcon} text-jd-gold text-3xl group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]`}></i>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-2xl tracking-tighter uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {config.logoText.split(' ')[0]}<span className="text-jd-gold">{config.logoText.split(' ')[1] || ''}</span>
            </span>
            <span className="text-[8px] text-jd-gold font-black uppercase mt-1 tracking-[0.3em] drop-shadow-md">
              Global Trading System
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6">
          {currentUser ? (
            <div className="flex items-center gap-6">
              <button 
                onClick={handleActionClick}
                className={`px-6 py-2.5 rounded-xl transition-all active:scale-95 text-[11px] font-black uppercase tracking-widest leading-none shadow-2xl ${
                  isScrolled 
                    ? 'bg-white/5 border border-white/10 hover:border-jd-gold/50 text-white hover:bg-white/10' 
                    : 'bg-black/30 backdrop-blur-xl border border-white/10 hover:border-jd-gold text-white shadow-black/50'
                }`}
              >
                {isAdmin ? '管理中心' : '最新市場消息'}
              </button>
              <button 
                onClick={onLogout} 
                className="text-white/30 hover:text-red-500 transition-all active:scale-90 px-2"
                title="登出系統"
              >
                <i className="fa-solid fa-power-off text-xl"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate(View.LOGIN)}
              className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-95 leading-none ${
                isScrolled 
                  ? 'bg-jd-gold text-jd-dark border border-jd-gold shadow-lg' 
                  : 'bg-jd-gold text-jd-dark border border-jd-gold shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:scale-105'
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