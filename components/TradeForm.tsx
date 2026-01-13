
import React, { useState } from 'react';
import { TradeConfig, User } from '../types';
import { COUNTRIES } from '../constants';
import { dataService } from '../dataService';

interface TradeFormProps {
  role: 'buyer' | 'seller';
  config: TradeConfig;
  currentUser: User | null;
  onBack: () => void;
  onSuccess: (data: any) => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ role, config, currentUser, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [formData, setFormData] = useState({
    commodity: '',
    quantity: '',
    price: '',
    clientName: currentUser?.name || '',
    contactEmail: currentUser?.email || '',
    contactPhone: currentUser?.phone || '',
    contactRegion: currentUser?.country || 'Singapore',
    socialType: 'WeChat',
    socialAccount: currentUser?.socialMedia || '',
    fileName: '',
    fileData: '' 
  });
  
  const isBuyer = role === 'buyer';
  const MAX_FILE_SIZE = 500 * 1024; // 縮減至 500KB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('附件過大！系統限制為 500K 以內。');
      e.target.value = '';
      return;
    }
    setFileProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, fileName: file.name, fileData: base64 }));
      setFileProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = { ...formData, type: role, timestamp: new Date().toISOString() };
      await dataService.submitTrade(submissionData);
      setLoading(false);
      alert('✅ 數據已成功存入 JD Morgan 核心雲端節點。');
      onSuccess(formData);
    } catch (err: any) {
      setLoading(false);
      alert(`提交失敗: ${err.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-32">
      {(loading || fileProcessing) && (
        <div className="fixed inset-0 bg-jd-dark/95 z-[200] flex flex-col items-center justify-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-jd-gold/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-jd-gold rounded-full animate-spin"></div>
          </div>
          <p className="text-jd-gold font-black tracking-widest uppercase animate-pulse text-center px-6">
            {fileProcessing ? 'Processing High-Capacity Attachment...' : 'Synchronizing with Global Node...'}
          </p>
        </div>
      )}

      <div className="bg-jd-light/40 backdrop-blur-lg border border-jd-gold/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className={`h-2 w-full bg-gradient-to-r ${isBuyer ? 'from-blue-600 to-transparent' : 'from-green-600 to-transparent'}`}></div>
        
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-white">{isBuyer ? '採購需求清單' : '供貨資源清單'}</h2>
              <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">
                {isBuyer ? 'Buyer Letter of Intent (LOI)' : 'Seller Soft Offer (SCO)'}
              </p>
            </div>
            <button type="button" onClick={onBack} className="text-gray-400 hover:text-white flex items-center transition-colors group">
              <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 返回選擇
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <section className="space-y-6">
              <h3 className="text-jd-gold text-sm font-black uppercase tracking-[0.2em] flex items-center">
                <span className="w-8 h-px bg-jd-gold/30 mr-3"></span> 交易細節
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-full">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">商品品名</label>
                  <select name="commodity" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-white focus:border-jd-gold outline-none cursor-pointer" required value={formData.commodity} onChange={handleInputChange}>
                    <option value="">請選擇商品...</option>
                    {config.commodities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">目標數量</label>
                  <input name="quantity" type="text" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-white focus:border-jd-gold outline-none" placeholder="例如: 100,000 MT" required value={formData.quantity} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">目標價格 (USD)</label>
                  <input name="price" type="number" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-white focus:border-jd-gold outline-none" placeholder="每單位價格" required value={formData.price} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-jd-gold text-sm font-black uppercase tracking-[0.2em] flex items-center">
                <span className="w-8 h-px bg-jd-gold/30 mr-3"></span> 文件上傳( 500K 限制)
              </h3>
              <div className="relative group">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${formData.fileName ? 'border-jd-gold bg-jd-gold/5' : 'border-gray-800 group-hover:border-jd-gold bg-jd-dark/20 group-hover:bg-jd-gold/5'}`}>
                  <i className={`fa-solid ${formData.fileName ? 'fa-file-circle-check text-jd-gold' : 'fa-file-shield text-gray-700'} text-4xl mb-4`}></i>
                  <p className="text-gray-500 font-medium text-sm">{formData.fileName || '點擊上傳關鍵文件 (PDF, JPG, DOCX)'}</p>
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button type="submit" disabled={loading || fileProcessing} className={`w-full ${isBuyer ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'} text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-[0.2em] flex items-center justify-center text-3xl disabled:opacity-50 leading-none`}>
                <i className="fa-solid fa-paper-plane mr-4"></i> 提交加密交易申請
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeForm;
