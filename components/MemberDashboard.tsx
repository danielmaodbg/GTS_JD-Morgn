import React from 'react';
import { User, View } from '../types';
import { MARKET_DATA, NEWS_ITEMS } from '../constants';

interface MemberDashboardProps {
  user: User;
  onNavigate: (view: View) => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white italic">
            Welcome back, <span className="text-jd-gold">{user.name || 'Member'}</span>
          </h2>
          <div className="flex items-center mt-3">
            {/* 下方方框顯示會員識別編號 */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/5 border border-blue-500/30 rounded shadow-inner">
              <i className="fa-solid fa-id-card-clip mr-3 text-blue-400/80 text-sm"></i>
              <span className="text-xs text-gray-400 uppercase font-black tracking-[0.2em] font-mono">
                {user.memberId || 'JD-GUEST'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate(View.BUYER_FORM)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-black text-2xl transition-all shadow-lg leading-none mt-1 shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
          >
            I WANT TO BUY
          </button>
          <button 
            onClick={() => onNavigate(View.SELLER_FORM)}
            className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-xl font-black text-2xl transition-all shadow-lg leading-none mt-1 shadow-[0_10px_30px_rgba(22,163,74,0.3)]"
          >
            I WANT TO SELL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-jd-light/40 backdrop-blur-sm border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-jd-dark/20">
              <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center">
                <i className="fa-solid fa-chart-line mr-2 text-jd-gold"></i> REAL-TIME MARKET DATA
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-gray-800">
              {MARKET_DATA.map((item, idx) => (
                <div key={idx} className="p-8 hover:bg-white/5 transition-colors group">
                  <p className="text-gray-500 text-[10px] font-black tracking-widest mb-2 uppercase">{item.symbol}</p>
                  <p className="text-white font-mono text-2xl mb-1">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;