import React, { useState } from 'react';

interface LegalGateProps {
  onAgree: () => void;
}

const LegalGate: React.FC<LegalGateProps> = ({ onAgree }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-jd-dark/95 backdrop-blur-2xl"></div>
      
      <div className="relative w-full max-w-3xl bg-jd-light border border-jd-gold/30 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-500 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-black/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-jd-gold/10 border border-jd-gold/30 flex items-center justify-center">
              <i className="fa-solid fa-gavel text-jd-gold text-3xl"></i>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
            LEGAL ACCESS <span className="text-jd-gold font-light not-italic">PROTOCOL</span>
          </h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">JD MORGAN GLOBAL TRADING LTD.</p>
        </div>

        {/* Legal Summary Content */}
        <div 
          onScroll={handleScroll}
          className="p-8 md:p-12 overflow-y-auto custom-scrollbar space-y-10 flex-grow"
        >
          <div className="space-y-4">
            <h3 className="text-jd-gold text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <span className="w-6 h-px bg-jd-gold/30"></span> 優先順序 01: 隱私權政策 (Privacy Policy)
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              根據卑詩省《個人資訊保護法》(PIPA)，我們收集為促進貿易協調所必需的商業相關個人資訊。您同意我們僅為執行貿易協調之目的，向經過審查的合作夥伴披露您的商業資訊。
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-jd-gold text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <span className="w-6 h-px bg-jd-gold/30"></span> 優先順序 02: 服務條款 (Terms of Service)
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              本服務條款構成法律約束力的協議。訪問我們的貿易情報與協調服務，即表示您確認已閱讀、理解並同意受本條款之約束。客戶同意自初次介紹後 24 個月內，不得繞過本公司。
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-jd-gold text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <span className="w-6 h-px bg-jd-gold/30"></span> 優先順序 03: 法律免責聲明 (Legal Disclaimer)
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium italic">
              本公司提供的所有貿易情報、市場分析及數據僅供參考。本公司不對任何資訊的完整性、準確性或可靠性作出明示或暗示的保證。因貨物質量、運輸延遲等引起之爭議由客戶與第三方自行解決。
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
            請向下滾動以確認您已閱讀並同意以上所有法律條款
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col gap-4">
          <button 
            onClick={onAgree}
            disabled={!hasScrolled}
            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 ${
              hasScrolled 
                ? 'bg-jd-gold text-jd-dark hover:scale-[1.02] shadow-[0_20px_50px_rgba(251,191,36,0.3)]' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {hasScrolled ? <i className="fa-solid fa-check-double"></i> : <i className="fa-solid fa-lock"></i>}
            我已閱讀並同意法律協議
          </button>
          <div className="text-[9px] text-gray-600 text-center uppercase tracking-widest font-bold">
            Governed by the laws of British Columbia, Canada
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalGate;