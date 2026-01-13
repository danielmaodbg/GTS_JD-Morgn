
import React from 'react';

interface RoleSelectionProps {
  onSelect: (role: 'buyer' | 'seller') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
      <div className="text-center mb-16 max-w-2xl">
        <h2 className="text-4xl font-black text-white mb-4">選擇您的交易身份</h2>
        <p className="text-gray-400 font-medium tracking-wide">
          JD Morgan 采用雙向交易撮合機制,運用AI高科技演算法為您精確匹配全球資源。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
        {/* Buyer Card */}
        <div 
          onClick={() => onSelect('buyer')}
          className="group relative bg-jd-light/40 hover:bg-jd-light/60 backdrop-blur-sm border border-jd-gold/5 hover:border-jd-gold/30 p-12 rounded-3xl cursor-pointer transition-all duration-500 transform hover:-translate-y-3 shadow-2xl"
        >
          <div className="absolute top-6 right-8 text-jd-gold/10 group-hover:text-jd-gold/30 transition-colors">
            <i className="fa-solid fa-cart-shopping text-9xl"></i>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-colors">
              <i className="fa-solid fa-magnifying-glass text-3xl text-blue-400"></i>
            </div>
            <h3 className="text-3xl font-black text-white mb-4">我是買家 (Buyer)</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              尋找全球大宗物資、提交購買意向書 (LOI)、尋求金融對接與供應鏈優化服務。
            </p>
            <span className="inline-flex items-center text-jd-gold font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
              立即採購 <i className="fa-solid fa-arrow-right ml-2"></i>
            </span>
          </div>
        </div>

        {/* Seller Card */}
        <div 
          onClick={() => onSelect('seller')}
          className="group relative bg-jd-light/40 hover:bg-jd-light/60 backdrop-blur-sm border border-jd-gold/5 hover:border-jd-gold/30 p-12 rounded-3xl cursor-pointer transition-all duration-500 transform hover:-translate-y-3 shadow-2xl"
        >
          <div className="absolute top-6 right-8 text-jd-gold/10 group-hover:text-jd-gold/30 transition-colors">
            <i className="fa-solid fa-ship text-9xl"></i>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-500/20 transition-colors">
              <i className="fa-solid fa-anchor text-3xl text-green-400"></i>
            </div>
            <h3 className="text-3xl font-black text-white mb-4">我是賣家 (Seller)</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              提供現貨或期貨資源、上傳產品證明 (POP)、設定履約保證與管理全球分配配額。
            </p>
            <span className="inline-flex items-center text-jd-gold font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
              開始供貨 <i className="fa-solid fa-arrow-right ml-2"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
