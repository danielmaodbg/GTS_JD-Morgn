import React from 'react';
import { User, View, Language } from '../types';
import { MARKET_DATA } from '../constants';
import { translations } from '../translations';

interface MemberDashboardProps {
  user: User;
  onNavigate: (view: View) => void;
  language: Language;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, onNavigate, language }) => {
  const t = translations[language];

  return (
    <div className="max-w-[1600px] mx-auto px-10 py-32 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white italic leading-tight">
            {t.member_welcome}<span className="text-jd-gold">{user.name || 'Member'}</span>
          </h2>
          <div className="flex items-center">
            <div className="inline-flex items-center px-6 py-3 bg-jd-gold/5 border border-jd-gold/30 rounded-xl shadow-inner backdrop-blur-sm">
              <i className="fa-solid fa-id-card-clip mr-4 text-jd-gold text-xl"></i>
              <span className="text-lg text-gray-400 uppercase font-black tracking-[0.3em] font-mono">
                {user.memberId || 'JD-GUEST'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <button 
            onClick={() => onNavigate(View.BUYER_FORM)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black text-2xl transition-all shadow-2xl leading-none shadow-blue-600/20 active:scale-95"
          >
            {t.member_buy}
          </button>
          <button 
            onClick={() => onNavigate(View.SELLER_FORM)}
            className="bg-green-600 hover:bg-green-500 text-white px-12 py-5 rounded-2xl font-black text-2xl transition-all shadow-2xl leading-none shadow-green-600/20 active:scale-95"
          >
            {t.member_sell}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-jd-light/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/30">
              <h3 className="text-white font-black uppercase tracking-widest text-lg flex items-center">
                <i className="fa-solid fa-chart-line mr-3 text-jd-gold"></i> {t.member_market_data}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-white/5">
              {MARKET_DATA.map((item, idx) => (
                <div key={idx} className="p-10 hover:bg-white/5 transition-colors group">
                  <p className="text-gray-500 text-xs font-black tracking-widest mb-3 uppercase group-hover:text-jd-gold transition-colors">{item.symbol}</p>
                  <p className="text-white font-mono text-3xl mb-1 font-black">{item.price}</p>
                  <p className={`text-sm font-black ${item.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {item.isUp ? '▲' : '▼'} {item.change}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Status Widget */}
        <div className="bg-jd-light/20 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center space-y-6">
           <div className="w-24 h-24 rounded-full bg-jd-gold/10 flex items-center justify-center border border-jd-gold/20 shadow-2xl">
              <i className="fa-solid fa-hourglass-half text-jd-gold text-4xl animate-pulse"></i>
           </div>
           <div>
              <p className="text-4xl font-black text-white mb-2">0</p>
              <p className="text-xs text-gray-500 font-black uppercase tracking-widest">{t.member_pending} SUBMISSIONS</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;