import React, { useState, useEffect, useRef } from 'react';

interface LegalGateProps {
  onAgree: () => void;
}

const LegalGate: React.FC<LegalGateProps> = ({ onAgree }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        if (scrollHeight <= clientHeight + 10) {
          setHasScrolled(true);
        }
      }
    };
    checkScroll();
    const timer = setTimeout(checkScroll, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#010411]/98 backdrop-blur-3xl"></div>
      
      <div className="relative w-full max-w-4xl bg-[#0a1128] border-2 border-jd-gold/40 rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in duration-500">
        {/* Header */}
        <div className="p-12 pb-8 text-center flex-shrink-0">
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 rounded-3xl bg-jd-gold/10 border border-jd-gold/40 flex items-center justify-center shadow-2xl">
              <i className="fa-solid fa-gavel text-jd-gold text-5xl"></i>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
            LEGAL ACCESS <span className="text-jd-gold italic">PROTOCOL</span>
          </h2>
          <p className="text-sm text-gray-500 font-black uppercase tracking-[0.6em] mt-5">JD MORGAN GLOBAL TRADING LTD.</p>
        </div>

        {/* Content Box */}
        <div className="px-12 py-4 flex-grow overflow-hidden flex flex-col">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="bg-black/40 border border-white/10 rounded-[2.5rem] p-10 md:p-14 overflow-y-auto custom-scrollbar space-y-10 flex-grow"
          >
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-bold text-center">
              本公司提供的所有貿易情報、市場分析及數據僅供參考。本公司不對任何資訊的完整性、準確性或可靠性作明示或暗示的保證。因貨物質量、運輸延遲等引起之爭議由客戶與第三方自行解決。
            </p>
          </div>

          {/* Affirmation Text - Restored to 3xl */}
          <div className="mt-10 mb-10 border-2 border-blue-500/50 bg-blue-500/10 p-10 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white text-2xl md:text-3xl font-black tracking-[0.1em] text-center">
              條款已閱讀完畢，請點擊下方按鈕確認
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-12 pt-0 flex flex-col items-center gap-10 flex-shrink-0">
          <button 
            onClick={onAgree}
            disabled={!hasScrolled}
            className={`w-full max-w-xl py-8 rounded-2xl font-black text-3xl uppercase tracking-[0.4em] transition-all shadow-[0_20px_80px_rgba(0,0,0,0.5)] flex items-center justify-center gap-8 ${
              hasScrolled 
                ? 'bg-jd-gold text-jd-dark hover:scale-105 shadow-jd-gold/40' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40'
            }`}
          >
            <i className="fa-solid fa-check-double text-3xl"></i>
            我已閱讀並同意
          </button>
          
          <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">
            GOVERNED BY THE LAWS OF BRITISH COLUMBIA, CANADA
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalGate;