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
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'syncing' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  });
  
  const isBuyer = role === 'buyer';
  const MAX_FILE_SIZE = 100 * 1024 * 1024; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert(`❌ 文件過大：系統上限為 100MB。`);
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
    setFormData(prev => ({ ...prev, fileName: file.name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.commodity) { alert("請選擇商品品名"); return; }
    
    if (!/^\d+$/.test(formData.contactPhone)) {
      alert("❌ 聯絡電話格式錯誤：請僅輸入數字。");
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(1);
    
    try {
      await dataService.ensureAuthenticated();
      
      await dataService.submitTrade(
        { ...formData, type: role }, 
        selectedFile || undefined, 
        (percent) => setUploadProgress(percent === 0 ? 1 : percent)
      );
      
      setUploadStatus('success');
      setUploadProgress(100);
      
      setTimeout(() => {
        onSuccess(formData);
      }, 1500);
    } catch (err: any) {
      setUploadStatus('idle');
      setUploadProgress(0);
      alert(`❌ 提交失敗: ${err.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'contactPhone') {
      const numericValue = value.replace(/\D/g, ''); 
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-32 bg-jd-dark">
      {uploadStatus !== 'idle' && (
        <div className="fixed inset-0 bg-jd-dark/95 z-[250] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 backdrop-blur-md">
          <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
            <div className={`absolute inset-0 border-b-4 border-l-4 border-jd-gold/10 rounded-full animate-spin-slow ${uploadStatus === 'success' ? 'hidden' : ''}`}></div>
            <div className="relative flex flex-col items-center">
              {uploadStatus === 'success' ? (
                <i className="fa-solid fa-check-double text-green-500 text-7xl animate-in zoom-in"></i>
              ) : (
                <>
                  <span className="text-5xl font-black text-jd-gold font-mono tracking-tighter">{uploadProgress}%</span>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Syncing Data</span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-6 max-w-md w-full">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {uploadStatus === 'uploading' ? 'Node Synchronizing' : 
                 uploadStatus === 'syncing' ? 'Indexing Metadata' : 'Broadcast Completed'}
              </h3>
              <p className="text-jd-gold text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                {uploadStatus === 'uploading' ? '正在將大容量文件同步至全球分發節點...' : 
                 uploadStatus === 'syncing' ? '正在為交易建立加密索引...' : '全球廣播已成功，資料已入庫'}
              </p>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div 
                className="h-full bg-gradient-to-r from-jd-gold to-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-jd-light border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className={`h-2 w-full bg-gradient-to-r ${isBuyer ? 'from-blue-600 to-transparent' : 'from-green-600 to-transparent'}`}></div>
        
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-white">{isBuyer ? '採購需求清單' : '供貨資源清單'}</h2>
              <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">
                {isBuyer ? 'Buyer Letter of Intent (LOI)' : 'Seller Soft Offer (SCO)'}
              </p>
            </div>
            <button type="button" onClick={onBack} className="text-gray-400 hover:text-white flex items-center transition-colors group">
              <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 返回選擇
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <section className="space-y-8">
              <h3 className="text-jd-gold text-sm font-black uppercase tracking-[0.2em] flex items-center">
                <span className="w-8 h-px bg-jd-gold/30 mr-3"></span> 聯絡資訊 (Contact Details)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">您的姓名 / 企業名稱</label>
                  <input name="clientName" type="text" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" placeholder="Enter Full Name" required value={formData.clientName} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">電子郵箱</label>
                  <input name="contactEmail" type="email" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" placeholder="example@email.com" required value={formData.contactEmail} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">聯絡電話 (僅限數字)</label>
                  <input name="contactPhone" type="tel" inputMode="numeric" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" placeholder="Phone Number (Digits only)" required value={formData.contactPhone} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">所在地 / 地區</label>
                  <select name="contactRegion" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none cursor-pointer" required value={formData.contactRegion} onChange={handleInputChange}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-full">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">社交帳號 (Rapid Communication)</label>
                  <div className="flex gap-4">
                    <select name="socialType" className="bg-jd-dark/80 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none cursor-pointer w-48" value={formData.socialType} onChange={handleInputChange}>
                      <option value="WeChat">WeChat</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Telegram">Telegram</option>
                      <option value="Line">Line</option>
                    </select>
                    <input name="socialAccount" type="text" className="flex-grow bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" placeholder="Account ID / Username" required value={formData.socialAccount} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-jd-gold text-sm font-black uppercase tracking-[0.2em] flex items-center">
                <span className="w-8 h-px bg-jd-gold/30 mr-3"></span> 交易細節 (Trade Specifics)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-full">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">商品品名</label>
                  <select name="commodity" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none cursor-pointer" required value={formData.commodity} onChange={handleInputChange}>
                    <option value="">請選擇商品...</option>
                    {config.commodities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">目標數量</label>
                  <input name="quantity" type="text" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" placeholder="例如: 100,000 MT" required value={formData.quantity} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">目標價格 (USD)</label>
                  <input name="price" type="number" className="w-full bg-jd-dark/60 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" placeholder="每單位報價" required value={formData.price} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-jd-gold text-sm font-black uppercase tracking-[0.2em] flex items-center">
                <span className="w-8 h-px bg-jd-gold/30 mr-3"></span> 證明文件 (Documentation)
              </h3>
              <div className="relative group">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${selectedFile ? 'border-jd-gold bg-jd-gold/5' : 'border-gray-800 group-hover:border-jd-gold bg-jd-dark/20 group-hover:bg-jd-gold/5'}`}>
                  <i className={`fa-solid ${selectedFile ? 'fa-file-circle-check text-jd-gold' : 'fa-clapperboard text-gray-700'} text-4xl mb-4`}></i>
                  <p className="text-gray-500 font-medium text-xs">
                    {selectedFile ? `已選擇：${selectedFile.name} (${(selectedFile.size/1024/1024).toFixed(2)}MB)` : '點擊或拖曳上傳證明文件、POP 影片或 LOI (PDF, MP4, JPG)'}
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={uploadStatus !== 'idle'} 
                className={`w-full ${isBuyer ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' : 'bg-green-600 hover:bg-green-500 shadow-green-500/20'} text-white font-black py-4 rounded-xl transition-all shadow-xl uppercase tracking-[0.2em] flex items-center justify-center text-xl disabled:opacity-50 leading-none group`}
              >
                <i className="fa-solid fa-cloud-arrow-up mr-3 group-hover:-translate-x-1 transition-transform"></i> 
                提交並廣播交易意向
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeForm;