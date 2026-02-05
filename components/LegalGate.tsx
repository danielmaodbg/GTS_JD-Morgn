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
    window.addEventListener('resize', checkScroll);
    const timer = setTimeout(checkScroll, 500);
    
    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-jd-dark/95 backdrop-blur-2xl"></div>
      
      <div className="relative w-full max-w-4xl bg-[#0a1128] border border-jd-gold/30 rounded-[3.5rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in duration-500 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-12 pb-6 text-center flex-shrink-0">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-jd-gold/10 border border-jd-gold/30 flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-gavel text-jd-gold text-4xl"></i>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
            LEGAL ACCESS <span className="text-jd-gold font-black italic not-italic">PROTOCOL</span>
          </h2>
          <p className="text-xs text-gray-500 font-black uppercase tracking-[0.5em] mt-4">JD MORGAN GLOBAL TRADING LTD.</p>
        </div>

        {/* Content Box */}
        <div className="px-10 py-6 flex-grow overflow-hidden flex flex-col">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="bg-black/30 border border-white/5 rounded-[2rem] p-8 md:p-12 overflow-y-auto custom-scrollbar space-y-12 flex-grow"
          >
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-bold text-center">
                本公司提供的所有貿易情報、市場分析及數據僅供參考。本公司不對任何資訊的完整性、準確性或可靠性作明示或暗示的保證。因貨物質量、運輸延遲等引起之爭議由客戶與第三方自行解決。
              </p>
            </div>
          </div>

          {/* Affirmation Text Box */}
          <div className="mt-8 mb-8 border border-blue-500/40 bg-blue-500/5 p-6 rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-sm md:text-base font-bold tracking-[0.1em]">
              條款已閱讀完畢，請點擊下方按鈕確認
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-12 pt-0 flex flex-col items-center gap-8 flex-shrink-0">
          <button 
            onClick={onAgree}
            disabled={!hasScrolled}
            className={`w-full max-w-lg py-6 rounded-2xl font-black text-2xl uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-6 ${
              hasScrolled 
                ? 'bg-jd-gold text-jd-dark hover:scale-[1.03] shadow-[0_20px_60px_rgba(251,191,36,0.4)]' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            <i className="fa-solid fa-check-double text-2xl"></i>
            我已閱讀並同意
          </button>
          
          <div className="text-xs text-gray-600 font-black uppercase tracking-[0.4em]">
            GOVERNED BY THE LAWS OF BRITISH COLUMBIA, CANADA
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalGate;