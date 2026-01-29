import React, { useState, useEffect, useCallback } from 'react';
import { TradeConfig, AppConfig, TradeSubmission, User, MemberType, View, SystemAnnouncement, MarketQuote, IndustryNews } from '../types';
import { dataService } from '../dataService';

interface AdminDashboardProps {
  config: TradeConfig;
  setConfig: React.Dispatch<React.SetStateAction<TradeConfig>>;
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  submissions: TradeSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<TradeSubmission[]>>;
  members: User[];
  setMembers: React.Dispatch<React.SetStateAction<User[]>>;
  onNavigate: (view: View) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  config, setConfig, appConfig, setAppConfig, submissions, setSubmissions, members, setMembers, onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'members' | 'data' | 'intelligence'>('data');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showActionFeedback = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const fetchData = useCallback(async (showLoader: boolean = true) => {
    if (activeTab === 'visual' && isDirty) return;
    if (showLoader) setIsFetching(true);
    try {
      if (activeTab === 'data') {
        const subs = await dataService.getSubmissions();
        setSubmissions(subs);
      } else if (activeTab === 'members') {
        const users = await dataService.getAllUsers();
        setMembers(users);
      } else {
        const cloudConfig = await dataService.getSettings();
        setAppConfig(cloudConfig);
        setIsDirty(false);
      }
    } catch (err) {
      console.error("Auto-sync failed:", err);
    } finally {
      if (showLoader) setIsFetching(false);
    }
  }, [activeTab, isDirty, setSubmissions, setMembers, setAppConfig]);

  useEffect(() => { fetchData(true); }, [fetchData]);

  const updateAppConfig = (updates: Partial<AppConfig>) => {
    setAppConfig(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await dataService.saveSettings(appConfig);
      setIsDirty(false);
      showActionFeedback("🚀 雲端情報配置同步完成！");
    } catch (err: any) { alert(`發佈失敗：${err.message}`); } finally { setIsSaving(false); }
  };

  const addAnnouncement = () => {
    const newAnn: SystemAnnouncement = { id: `ann_${Date.now()}`, title: '新公告標題', content: '內容描述...', date: new Date().toISOString().split('T')[0], isPriority: false };
    updateAppConfig({ announcements: [newAnn, ...(appConfig.announcements || [])] });
  };

  const addQuote = () => {
    const newQuote: MarketQuote = { id: `q_${Date.now()}`, symbol: 'NEW SYMBOL', price: '0.00', change: '0.00%', isUp: true, sourceUrl: '' };
    updateAppConfig({ quotes: [newQuote, ...(appConfig.quotes || [])] });
  };

  const addIndustryNews = () => {
    const newNews: IndustryNews = { id: `news_${Date.now()}`, title: '新產業新聞標題', time: '剛剛', category: 'General', sourceUrl: '' };
    updateAppConfig({ industryNews: [newNews, ...(appConfig.industryNews || [])] });
  };

  const renderTabContent = () => {
    if (isFetching) return <div className="py-32 text-center text-jd-gold animate-pulse font-black uppercase tracking-widest">Loading Terminal Data...</div>;

    switch (activeTab) {
      case 'intelligence':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-32">
            {/* Announcements Management */}
            <div className="bg-jd-light/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-jd-gold text-sm font-black uppercase tracking-widest flex items-center"><i className="fa-solid fa-bullhorn mr-3"></i> 系統重要公告</h3>
                <button onClick={addAnnouncement} className="bg-jd-gold/10 text-jd-gold px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border border-jd-gold/20 hover:bg-jd-gold hover:text-jd-dark transition-all">+ 新增公告</button>
              </div>
              <div className="space-y-4">
                {(appConfig.announcements || []).map((ann, idx) => (
                  <div key={ann.id} className="p-6 bg-black/20 rounded-2xl border border-white/5 space-y-4 relative group">
                    <button onClick={() => updateAppConfig({ announcements: appConfig.announcements.filter(a => a.id !== ann.id) })} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-trash"></i></button>
                    <input type="text" value={ann.title} onChange={(e) => {
                      const newAnns = [...appConfig.announcements];
                      newAnns[idx].title = e.target.value;
                      updateAppConfig({ announcements: newAnns });
                    }} className="w-full bg-jd-dark border border-white/10 rounded-xl p-3 text-white font-bold" placeholder="公告標題" />
                    <textarea value={ann.content} onChange={(e) => {
                      const newAnns = [...appConfig.announcements];
                      newAnns[idx].content = e.target.value;
                      updateAppConfig({ announcements: newAnns });
                    }} className="w-full bg-jd-dark border border-white/10 rounded-xl p-3 text-gray-400 text-sm h-24" placeholder="公告內容" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quotes Management */}
            <div className="bg-jd-light/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-jd-gold text-sm font-black uppercase tracking-widest flex items-center"><i className="fa-solid fa-chart-line mr-3"></i> 商品報價管理</h3>
                <button onClick={addQuote} className="bg-jd-gold/10 text-jd-gold px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border border-jd-gold/20 hover:bg-jd-gold hover:text-jd-dark transition-all">+ 新增報價</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(appConfig.quotes || []).map((quote, idx) => (
                  <div key={quote.id} className="p-6 bg-black/20 rounded-2xl border border-white/5 space-y-3 relative group">
                     <button onClick={() => updateAppConfig({ quotes: appConfig.quotes.filter(q => q.id !== quote.id) })} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"><i className="fa-solid fa-xmark"></i></button>
                     <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={quote.symbol} onChange={(e) => {
                          const newQuotes = [...appConfig.quotes];
                          newQuotes[idx].symbol = e.target.value;
                          updateAppConfig({ quotes: newQuotes });
                        }} className="bg-jd-dark border border-white/10 rounded-lg p-2 text-white text-[11px] font-bold" placeholder="標的 (Symbol)" />
                        <input type="text" value={quote.price} onChange={(e) => {
                          const newQuotes = [...appConfig.quotes];
                          newQuotes[idx].price = e.target.value;
                          updateAppConfig({ quotes: newQuotes });
                        }} className="bg-jd-dark border border-white/10 rounded-lg p-2 text-jd-gold text-[11px] font-mono" placeholder="價格" />
                     </div>
                     <input type="text" value={quote.sourceUrl} onChange={(e) => {
                        const newQuotes = [...appConfig.quotes];
                        newQuotes[idx].sourceUrl = e.target.value;
                        updateAppConfig({ quotes: newQuotes });
                      }} className="w-full bg-jd-dark border border-white/5 rounded-lg p-2 text-[9px] text-gray-500" placeholder="來源鏈結 (Source URL)" />
                  </div>
                ))}
              </div>
            </div>

            {/* Industry News Management */}
            <div className="bg-jd-light/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-jd-gold text-sm font-black uppercase tracking-widest flex items-center"><i className="fa-solid fa-newspaper mr-3"></i> 產業動態管理</h3>
                <button onClick={addIndustryNews} className="bg-jd-gold/10 text-jd-gold px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border border-jd-gold/20 hover:bg-jd-gold hover:text-jd-dark transition-all">+ 新增新聞</button>
              </div>
              <div className="space-y-4">
                {(appConfig.industryNews || []).map((news, idx) => (
                  <div key={news.id} className="p-6 bg-black/20 rounded-2xl border border-white/5 space-y-3 relative group">
                     <button onClick={() => updateAppConfig({ industryNews: appConfig.industryNews.filter(n => n.id !== news.id) })} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-trash text-xs"></i></button>
                     <input type="text" value={news.title} onChange={(e) => {
                        const newItems = [...appConfig.industryNews];
                        newItems[idx].title = e.target.value;
                        updateAppConfig({ industryNews: newItems });
                      }} className="w-full bg-jd-dark border border-white/10 rounded-xl p-3 text-white font-black text-sm" placeholder="新聞標題" />
                     <div className="flex gap-4">
                        <input type="text" value={news.category} onChange={(e) => {
                          const newItems = [...appConfig.industryNews];
                          newItems[idx].category = e.target.value;
                          updateAppConfig({ industryNews: newItems });
                        }} className="bg-jd-dark border border-white/10 rounded-lg p-2 text-[10px] text-jd-gold flex-grow" placeholder="分類" />
                        <input type="text" value={news.sourceUrl} onChange={(e) => {
                          const newItems = [...appConfig.industryNews];
                          newItems[idx].sourceUrl = e.target.value;
                          updateAppConfig({ industryNews: newItems });
                        }} className="bg-jd-dark border border-white/10 rounded-lg p-2 text-[10px] text-gray-500 flex-grow" placeholder="原文鏈結" />
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="bg-jd-light/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-jd-gold border-b border-white/5">
                  <th className="px-8 py-6">意向類型</th>
                  <th className="px-8 py-6">物資品名</th>
                  <th className="px-8 py-6">規模 / 報價</th>
                  <th className="px-8 py-6">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-xs">{sub.type.toUpperCase()}</td>
                    <td className="px-8 py-6 text-white font-bold">{sub.commodity}</td>
                    <td className="px-8 py-6 text-xs">${sub.price} USD</td>
                    <td className="px-8 py-6">
                       <button onClick={async () => {
                         if(window.confirm('確定刪除？')) {
                           await dataService.deleteSubmission(sub.id);
                           setSubmissions(s => s.filter(x => x.id !== sub.id));
                         }
                       }} className="text-red-500 hover:text-white"><i className="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'members':
        return <div className="p-10 text-center text-gray-500">會員矩陣管理介面</div>;
      case 'visual':
        return <div className="p-10 text-center text-gray-500">視覺控制管理介面</div>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-48">
      {actionMessage && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-500 px-8 py-3 rounded-full font-black text-sm bg-jd-gold text-jd-dark shadow-2xl flex items-center gap-3">
          {actionMessage}
        </div>
      )}

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">JD MORGAN <span className="text-jd-gold font-light not-italic ml-2">ADMINISTRATION</span></h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">GLOBAL NODE TERMINAL 1.0</p>
        </div>
        <button onClick={() => onNavigate(View.HOME)} className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"><i className="fa-solid fa-house"></i> 回到首頁</button>
      </div>

      <div className="flex bg-jd-light rounded-2xl p-1 border border-white/5 overflow-x-auto mb-10 shadow-2xl">
        {[ 
          { id: 'data', icon: 'fa-chart-pie', label: '數據總覽' }, 
          { id: 'intelligence', icon: 'fa-microchip', label: '情報管理' },
          { id: 'visual', icon: 'fa-wand-magic-sparkles', label: '視覺控制' }, 
          { id: 'members', icon: 'fa-users-viewfinder', label: '會員矩陣' } 
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-10 py-5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center whitespace-nowrap ${activeTab === tab.id ? 'bg-jd-gold text-jd-dark shadow-xl' : 'text-gray-500 hover:text-white'}`}><i className={`fa-solid ${tab.icon} mr-3`}></i> {tab.label}</button>
        ))}
      </div>

      <div className="min-h-[500px]">{renderTabContent()}</div>

      <div className="fixed bottom-0 left-0 w-full z-[150] p-6 flex justify-center pointer-events-none">
        <div className="max-w-5xl w-full bg-jd-light/95 backdrop-blur-2xl border border-jd-gold/30 rounded-2xl p-6 flex items-center justify-between gap-6 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isDirty ? 'bg-jd-gold animate-pulse' : 'bg-green-500'}`}></div>
            <p className="text-white text-xs font-black uppercase tracking-widest">{isDirty ? '有未發佈的情報修改' : '所有數據已與雲端同步'}</p>
          </div>
          <button 
            onClick={handlePublish} 
            disabled={isSaving || !isDirty} 
            className={`px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isDirty ? 'bg-jd-gold text-jd-dark shadow-xl hover:scale-105' : 'bg-gray-800 text-gray-500'}`}
          >
            {isSaving ? '正在同步...' : '發佈最新情報'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;