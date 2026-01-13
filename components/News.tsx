import React from 'react';
import { View, NewsItem } from '../types';
import { NEWS_ITEMS } from '../constants';

interface NewsProps {
  onBack: () => void;
}

const News: React.FC<NewsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-jd-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-jd-gold text-sm font-black uppercase tracking-[0.4em] mb-3">Global Information Terminal</h2>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
              LATEST <span className="text-jd-gold font-light not-italic">INTELLIGENCE</span>
            </h1>
          </div>
          <button 
            onClick={onBack}
            className="text-white/40 hover:text-jd-gold transition-colors font-black uppercase tracking-widest text-sm flex items-center group"
          >
            <i className="fa-solid fa-arrow-left mr-3 group-hover:-translate-x-2 transition-transform"></i>
            返回主頁
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="bg-jd-light/30 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:border-jd-gold/30 transition-all group cursor-pointer shadow-2xl flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-jd-gold/10 text-jd-gold rounded-lg text-[10px] font-black uppercase tracking-widest border border-jd-gold/20">
                  {item.category}
                </span>
                <span className="text-white/20 font-mono text-xs">{item.time}</span>
              </div>
              
              <h3 className="text-2xl font-black text-white leading-tight mb-6 group-hover:text-jd-gold transition-colors flex-grow">
                {item.title}
              </h3>
              
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Read Dispatch</span>
                <i className="fa-solid fa-chevron-right text-jd-gold opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2"></i>
              </div>
            </div>
          ))}

          {/* Featured Notice Card */}
          <div className="lg:col-span-3 bg-gradient-to-br from-jd-gold/10 via-jd-light/40 to-jd-dark p-12 rounded-[2.5rem] border border-jd-gold/20 relative overflow-hidden group shadow-2xl mt-8">
             <div className="absolute -right-20 -bottom-20 text-jd-gold/5 text-[15rem] font-black italic select-none pointer-events-none group-hover:text-jd-gold/10 transition-all duration-1000">JD</div>
             <div className="relative z-10 max-w-3xl">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-jd-gold rounded-xl flex items-center justify-center text-jd-dark text-2xl font-black">
                   <i className="fa-solid fa-bullhorn"></i>
                 </div>
                 <h2 className="text-white font-black text-2xl uppercase tracking-widest">系統重要公告</h2>
               </div>
               <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                 JD Morgan 全球節點升級：引入 AI 智能物資分配演算法 V3.0
               </h3>
               <p className="text-gray-400 text-lg leading-relaxed mb-10">
                 我們已在所有核心交易終端部署了最新的量化分配系統，該更新將顯著提升 LOI 與 SCO 的自動對接效率，平均減少 40% 的審核等待時間。
               </p>
               <button className="bg-jd-gold hover:bg-yellow-400 text-jd-dark font-black px-10 py-4 rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95">
                 查看技術白皮書
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;