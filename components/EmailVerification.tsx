import React, { useState } from 'react';
import { dataService } from '../dataService';

interface EmailVerificationProps {
  email: string;
  onContinue: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onContinue }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleResend = async () => {
    setStatus('sending');
    setErrorMsg('');
    try {
      await dataService.resendVerificationEmail();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message === 'USER_NOT_LOGGED_IN' 
        ? "Session 過期，請嘗試重新登入再進行驗證。" 
        : "發送過於頻繁或伺服器異常，請稍後再試。");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* 全球貿易氛圍底圖 */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-105 transition-transform duration-[10s] animate-pulse"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop')`,
          filter: 'brightness(0.2) blur(8px)'
        }}
      />
      
      {/* 品牌質感遮罩層 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-jd-dark/40 via-jd-dark/80 to-jd-dark"></div>

      {/* 核心內容卡片 */}
      <div className="relative z-10 w-full max-w-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-1000">
        
        {/* 頂部裝飾金線 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jd-gold to-transparent opacity-50"></div>
        
        {/* 動態安全圖示 */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className={`absolute inset-0 bg-jd-gold/20 blur-2xl rounded-full transition-all duration-700 ${status === 'success' ? 'bg-green-500/40 scale-150' : 'group-hover:scale-125'}`}></div>
            <div className={`relative w-28 h-28 rounded-full border border-white/10 flex items-center justify-center transition-all duration-700 ${status === 'success' ? 'border-green-500 bg-green-500/10' : 'bg-jd-dark/60'}`}>
              {status === 'sending' ? (
                <i className="fa-solid fa-compass-drafting text-jd-gold text-5xl animate-spin"></i>
              ) : status === 'success' ? (
                <i className="fa-solid fa-shield-check text-green-500 text-5xl animate-in zoom-in"></i>
              ) : (
                <i className="fa-solid fa-envelope-open-text text-jd-gold text-5xl animate-bounce"></i>
              )}
            </div>
          </div>
        </div>

        {/* 文字編排區塊 */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-jd-gold text-[10px] font-black uppercase tracking-[0.6em]">Awaiting Identity Confirmation</p>
            <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              {status === 'success' ? 'DISPATCHED' : 'VERIFICATION'} <br />
              <span className="text-jd-gold font-light not-italic">REQUIRED</span>
            </h2>
          </div>

          <div className="max-w-md mx-auto">
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">
              我們已向加密終端發送了一封身分確認信件至：<br />
              <span className="inline-block mt-2 text-white font-mono bg-white/5 px-4 py-1 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                {email}
              </span>
            </p>
            <p className="text-gray-500 text-xs mt-4 italic font-medium">
              請在 24 小時內點擊郵件中的專屬連結，以解鎖您的全球交易權限。
            </p>
          </div>
        </div>

        {/* 錯誤反饋 */}
        {status === 'error' && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold animate-in slide-in-from-top-2">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {errorMsg}
          </div>
        )}

        {/* 控制按鈕區塊 */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button 
            onClick={onContinue}
            className="w-full bg-jd-gold hover:bg-yellow-400 text-jd-dark font-black py-5 rounded-2xl shadow-[0_15px_40px_rgba(251,191,36,0.2)] hover:shadow-jd-gold/40 transition-all uppercase tracking-[0.2em] text-xl flex items-center justify-center group"
          >
            我已完成驗證，進入系統 
            <i className="fa-solid fa-arrow-right-long ml-4 group-hover:translate-x-2 transition-transform"></i>
          </button>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">沒收到郵件？</p>
            <button 
              onClick={handleResend}
              disabled={status === 'sending' || status === 'success'}
              className={`text-xs font-black uppercase tracking-[0.1em] transition-all border-b-2 pb-0.5 ${
                status === 'sending' ? 'text-gray-700 border-transparent' : 'text-jd-gold border-jd-gold/30 hover:text-white hover:border-white'
              }`}
            >
              {status === 'sending' ? '正在廣播重發請求...' : status === 'success' ? '發送成功，請檢查信箱' : '重新發送驗證郵件'}
            </button>
          </div>
        </div>

        {/* 底部裝飾 */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] text-gray-600 font-black uppercase tracking-[0.3em]">
          <span>Security Level: AES-256</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>Node: JD-GLOBAL-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;