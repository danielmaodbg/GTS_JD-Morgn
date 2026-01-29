import React, { useEffect, useState } from 'react';
import { View, AppConfig } from '../types';
import { INITIAL_APP_CONFIG } from '../constants';
import { dataService } from '../dataService';

interface NewsProps {
  onBack: () => void;
}

const News: React.FC<NewsProps> = ({ onBack }) => {
  const [config, setConfig] = useState<AppConfig>(INITIAL_APP_CONFIG);

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getSettings();
      if (data) setConfig(data);
    };
    load();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-jd-dark">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-jd-gold text-sm font-black uppercase tracking-[0.4em] mb-3">Global Intelligence Terminal</h2>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              LATEST <span className="text-jd-gold font-light">INTELLIGENCE</span>
            </h1>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-white/5 hover:bg-jd-gold text-white hover:text-jd-dark border border-white/10 hover:border-jd-gold rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center group"
          >
            <i className="fa-solid fa-arrow-left mr-3 group-hover:-translate-x-2 transition-transform"></i>
            返回主頁
          </button>
        </div>

        {/* Section 1: System Announcements (Priority 1) */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-1 h-px bg-jd-gold/30"></div>
            <h3 className="text-jd-gold text-xs font-black uppercase tracking-widest">系統重要公告 | Announcements</h3>
          </div>
          <div className="space-y-6">
            {(config.announcements || []).map((ann) => (
              <div key={ann.id} className="bg-gradient-to-br from-jd-light to-jd-dark p-10 rounded-[2.5rem] border border-jd-gold/20 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                   <i className="fa-solid fa-bullhorn text-[12rem] text-white"></i>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 bg-jd-gold/10 rounded-2xl flex items-center justify-center border border-jd-gold/30 text-jd-gold shrink-0">
                    <i className="fa-solid fa-shield-halved text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-jd-gold/60 uppercase tracking-widest mb-2 block">{ann.date}</span>
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-4">{ann.title}</h4>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">{ann.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Commodity Spot Prices (Quotes) */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-1 h-px bg-jd-gold/30"></div>
            <h3 className="text-jd-gold text-xs font-black uppercase tracking-widest">大宗商品報價 | Market Quotes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(config.quotes || []).map((quote) => (
              <div key={quote.id} className="bg-jd-light border border-white/5 p-8 rounded-3xl hover:border-jd-gold/30 transition-all group shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{quote.symbol}</span>
                  {quote.sourceUrl && (
                    <a href={quote.sourceUrl} target="_blank" rel="noreferrer" className="text-[9px] text-jd-gold/40 hover:text-jd-gold transition-colors">
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-white font-mono tracking-tighter">${quote.price}</span>
                  <span className={`text-xs font-black font-mono mb-1 ${quote.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {quote.isUp ? '▲' : '▼'} {quote.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Industry News */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-1 h-px bg-jd-gold/30"></div>
            <h3 className="text-jd-gold text-xs font-black uppercase tracking-widest">最新產業動態 | Industry Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(config.industryNews || []).map((item) => (
              <a 
                key={item.id} 
                href={item.sourceUrl || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="bg-jd-light/40 border border-white/5 p-8 rounded-3xl hover:border-jd-gold/40 transition-all group cursor-pointer shadow-xl flex flex-col h-full hover:bg-jd-light"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 group-hover:bg-jd-gold/10 group-hover:text-jd-gold transition-colors">
                    {item.category}
                  </span>
                  <span className="text-gray-500 font-mono text-[10px]">{item.time}</span>
                </div>
                <h3 className="text-xl font-black text-white leading-tight mb-8 group-hover:text-glow-text transition-all flex-grow">
                  {item.title}
                </h3>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Read Source Dispatch</span>
                  <i className="fa-solid fa-chevron-right text-jd-gold opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2"></i>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default News;