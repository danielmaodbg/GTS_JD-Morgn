import React, { useEffect } from 'react';

interface FraudReportProps {
  onBack: () => void;
}

const FraudReport: React.FC<FraudReportProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-jd-dark selection:bg-red-500/20 selection:text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-jd-gold text-sm font-black uppercase tracking-[0.5em] flex items-center">
               COMPLIANCE & SECURITY
            </h2>
            <h1 className="text-4xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none items-center">
              <span className="block">詐欺舉報</span> 
    <span className="block text-jd-gold font-light not-italic">
    與風險預警
  </span>
            </h1>
            <p className="text-xs text-white font-bold uppercase tracking-widest items-center">
              Fraud Reporting Center </p> <p className="Bolck items-center" JD Morgan Global Trading Compliance
            </p>
          </div>
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-white/5 hover:bg-jd-gold text-white border border-white/10 hover:border-red-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-md"
          >
            <i className="fa-solid fa-arrow-left"></i> 返回系統
          </button>
        </div>

        <div className="bg-jd-light/95 backdrop-blur-xl border border-jd-gold/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
            <i className="fa-solid fa-user-shield text-[15rem] text-white"></i>
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="border-b border-white/5 pb-6">
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">FRAUD PROTECTION PROTOCOL | 舉報協議</h2>
              <p className="text-white text-[10px] font-black uppercase tracking-widest">Anti-Money Laundering & Fraud Prevention</p>
            </div>

            <div className="space-y-8 text-white leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 bg-black/20 rounded-2xl border border-white/5">
                  <h3 className="text-white font-black uppercase tracking-widest mb-4">舉報對象</h3>
                  <p className="text-sm text-gray-400">
                    若您發現任何冒充 JD Morgan 員工、偽造本公司文件、或要求向未經授權帳戶匯款的行為，請立即通過此管道舉報。
                  </p>
                </div>
                <div className="p-8 bg-black/20 rounded-2xl border border-white/5">
                  <h3 className="text-white font-black uppercase tracking-widest mb-4">匿名保證</h3>
                  <p className="text-sm text-white">
                    JD Morgan 對所有舉報人的身分嚴格保密。我們致力於維護全球貿易環境的真實性與安全性。
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h3 className="text-jd-gold text-lg font-black uppercase tracking-widest mb-6">聯繫合規部門 (Contact Compliance)</h3>
                <p className="text-sm mb-6">
                  請將相關電子郵件、截圖、通話記錄及對方聯繫資訊發送至以下專屬地址：
                </p>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <span className="block text-[10px] text-gray-500 font-black uppercase mb-1">合規郵箱</span>
                    <span className="text-lg font-mono text-white select-all">compliance@jdmorgan.ca</span>
                  </div>
                  <div className="flex-1 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <span className="block text-[10px] text-gray-500 font-black uppercase mb-1">緊急熱線</span>
                    <span className="text-lg font-mono text-white select-all">+1 (JD-MORGAN-SAFETY)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-16 pb-20 space-y-4">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">
            PROTECTING THE INTEGRITY OF GLOBAL COMMODITY TRADING
          </p>
        </div>
      </div>
    </div>
  );
};

export default FraudReport;