import React, { useState, useEffect, useCallback } from 'react';
import { TradeConfig, AppConfig, TradeSubmission, User, MemberType, View, SystemAnnouncement, MarketQuote, IndustryNews, HeroSlide } from '../types';
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
      showActionFeedback("🚀 數據同步完成！");
    } catch (err: any) { alert(`發佈失敗：${err.message}`); } finally { setIsSaving(false); }
  };

  // --- Visual Control Handlers ---
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide_${Date.now()}`,
      img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop',
      title: '新交易標題',
      subtitle: '新交易副標題',
      order: (appConfig.heroSlides?.length || 0) + 1
    };
    updateAppConfig({ heroSlides: [...(appConfig.heroSlides || []), newSlide] });
  };

  const handleRemoveSlide = (id: string) => {
    updateAppConfig({ heroSlides: appConfig.heroSlides.filter(s => s.id !== id) });
  };

  const handleUpdateSlide = (id: string, updates: Partial<HeroSlide>) => {
    updateAppConfig({
      heroSlides: appConfig.heroSlides.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  // --- Member Matrix Handlers ---
  const handleToggleApproval = async (uid: string, currentStatus: boolean) => {
    try {
      await dataService.toggleUserApproval(uid, !currentStatus);
      setMembers(prev => prev.map(m => m.uid === uid ? { ...m, isApproved: !currentStatus } : m));
      showActionFeedback("✅ 會員狀態已更新");
    } catch (e) { alert("更新失敗"); }
  };

  const handleRoleChange = async (uid: string, newRole: MemberType) => {
    try {
      await dataService.updateUserRole(uid, newRole);
      setMembers(prev => prev.map(m => m.uid === uid ? { ...m, memberType: newRole } : m));
      showActionFeedback("✅ 權限已變更");
    } catch (e) { alert("變更失敗"); }
  };

  const handleDeleteMember = async (uid: string) => {
    if (!window.confirm("確定要移除此會員嗎？此動作無法復原。")) return;
    try {
      await dataService.deleteUser(uid);
      setMembers(prev => prev.filter(m => m.uid !== uid));
      showActionFeedback("🗑️ 會員已刪除");
    } catch (e) { alert("刪除失敗"); }
  };

  const renderTabContent = () => {
    if (isFetching) return <div className="py-48 text-center text-jd-gold animate-pulse font-black uppercase tracking-widest text-3xl">正在載入終端數據...</div>;

    switch (activeTab) {
      case 'intelligence':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 pb-48">
            <div className="bg-jd-light/40 p-12 rounded-[3rem] border border-white/5 space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-jd-gold text-2xl font-black uppercase tracking-widest flex items-center"><i className="fa-solid fa-bullhorn mr-4"></i> 系統公告管理</h3>
                <button onClick={() => {
                   const newAnn = { id: `ann_${Date.now()}`, title: '新公告', content: '內容...', date: new Date().toISOString().split('T')[0], isPriority: false };
                   updateAppConfig({ announcements: [newAnn, ...(appConfig.announcements || [])] });
                }} className="bg-jd-gold/10 text-jd-gold px-8 py-3 rounded-2xl text-lg font-black uppercase border border-jd-gold/30 hover:bg-jd-gold hover:text-jd-dark transition-all">+ 新增公告</button>
              </div>
              <div className="space-y-6">
                {(appConfig.announcements || []).map((ann, idx) => (
                  <div key={ann.id} className="p-8 bg-black/40 rounded-3xl border border-white/10 space-y-6 relative group">
                    <button onClick={() => updateAppConfig({ announcements: appConfig.announcements.filter(a => a.id !== ann.id) })} className="absolute top-6 right-6 text-red-500 hover:text-red-400 text-2xl"><i className="fa-solid fa-trash-can"></i></button>
                    <input type="text" value={ann.title} onChange={(e) => {
                      const newAnns = [...appConfig.announcements];
                      newAnns[idx].title = e.target.value;
                      updateAppConfig({ announcements: newAnns });
                    }} className="w-full bg-jd-dark border border-white/10 rounded-2xl p-5 text-white font-black text-2xl" placeholder="標題" />
                    <textarea value={ann.content} onChange={(e) => {
                      const newAnns = [...appConfig.announcements];
                      newAnns[idx].content = e.target.value;
                      updateAppConfig({ announcements: newAnns });
                    }} className="w-full bg-jd-dark border border-white/10 rounded-2xl p-5 text-gray-400 text-xl h-40" placeholder="內容" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'visual':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 pb-48">
            {/* Logo & Identity */}
            <div className="bg-jd-light/40 p-12 rounded-[3rem] border border-white/5 space-y-10">
              <h3 className="text-jd-gold text-2xl font-black uppercase tracking-widest flex items-center"><i className="fa-solid fa-fingerprint mr-4"></i> 品牌識別與 Logo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Logo 文字內容</label>
                  <input 
                    type="text" 
                    value={appConfig.logoText} 
                    onChange={(e) => updateAppConfig({ logoText: e.target.value })} 
                    className="w-full bg-jd-dark border border-white/10 rounded-2xl p-6 text-white text-2xl font-black outline-none focus:border-jd-gold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">Font Awesome 圖標代碼</label>
                  <input 
                    type="text" 
                    value={appConfig.logoIcon} 
                    onChange={(e) => updateAppConfig({ logoIcon: e.target.value })} 
                    className="w-full bg-jd-dark border border-white/10 rounded-2xl p-6 text-white text-2xl font-black outline-none focus:border-jd-gold"
                    placeholder="e.g. fa-earth-americas"
                  />
                </div>
              </div>
            </div>

            {/* Hero Slides */}
            <div className="bg-jd-light/40 p-12 rounded-[3rem] border border-white/5 space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-jd-gold text-2xl font-black uppercase tracking-widest flex items-center"><i className="fa-solid fa-images mr-4"></i> 首頁英雄區塊輪播</h3>
                <button 
                  onClick={handleAddSlide}
                  className="bg-jd-gold/10 text-jd-gold px-8 py-3 rounded-2xl text-lg font-black uppercase border border-jd-gold/30 hover:bg-jd-gold hover:text-jd-dark transition-all"
                >
                  + 新增幻燈片
                </button>
              </div>
              <div className="grid grid-cols-1 gap-10">
                {appConfig.heroSlides.map((slide, idx) => (
                  <div key={slide.id} className="p-8 bg-black/30 rounded-[2.5rem] border border-white/10 flex flex-col lg:flex-row gap-10 relative group">
                    <button 
                      onClick={() => handleRemoveSlide(slide.id)} 
                      className="absolute top-6 right-6 text-red-500 hover:text-red-400 text-3xl z-10"
                    >
                      <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                    
                    <div className="w-full lg:w-80 shrink-0">
                      <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 mb-4 bg-jd-dark relative group/img">
                        <img src={slide.img} className="w-full h-full object-cover" alt="" />
                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity text-white font-black uppercase text-sm">
                          更換圖片
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await dataService.uploadFile(file, `hero_slides/${slide.id}`);
                                handleUpdateSlide(slide.id, { img: url });
                              }
                            }} 
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex-grow space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">主標題</label>
                          <input 
                            type="text" 
                            value={slide.title} 
                            onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })} 
                            className="w-full bg-jd-dark border border-white/5 rounded-xl p-4 text-white font-black text-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">副標題</label>
                          <input 
                            type="text" 
                            value={slide.subtitle} 
                            onChange={(e) => handleUpdateSlide(slide.id, { subtitle: e.target.value })} 
                            className="w-full bg-jd-dark border border-white/5 rounded-xl p-4 text-white font-medium text-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">顯示順序</label>
                        <input 
                          type="number" 
                          value={slide.order} 
                          onChange={(e) => handleUpdateSlide(slide.id, { order: parseInt(e.target.value) })} 
                          className="w-32 bg-jd-dark border border-white/5 rounded-xl p-4 text-jd-gold font-mono text-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 pb-48">
            <div className="bg-jd-light/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-sm font-black uppercase tracking-[0.2em] text-jd-gold border-b border-white/10">
                    <th className="px-10 py-8">會員識別</th>
                    <th className="px-10 py-8">身份資訊</th>
                    <th className="px-10 py-8">權限級別</th>
                    <th className="px-10 py-8">狀態</th>
                    <th className="px-10 py-8 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((member) => (
                    <tr key={member.uid} className="hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-8">
                        <span className="font-mono text-jd-gold text-2xl font-black tracking-tighter">
                          {member.memberId || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-white font-black text-2xl">{member.name || member.username}</span>
                          <span className="text-gray-500 text-sm font-mono tracking-widest">{member.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <select 
                          value={member.memberType} 
                          onChange={(e) => handleRoleChange(member.uid!, e.target.value as MemberType)}
                          className="bg-jd-dark border border-white/10 rounded-xl px-5 py-3 text-lg font-black text-white focus:border-jd-gold outline-none cursor-pointer"
                        >
                          {Object.values(MemberType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </td>
                      <td className="px-10 py-8">
                        <button 
                          onClick={() => handleToggleApproval(member.uid!, !!member.isApproved)}
                          className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                            member.isApproved 
                              ? 'bg-green-500/10 text-green-500 border border-green-500/30' 
                              : 'bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse'
                          }`}
                        >
                          {member.isApproved ? '已核准' : '待核准'}
                        </button>
                      </td>
                      <td className="px-10 py-8 text-center">
                         <button 
                           onClick={() => handleDeleteMember(member.uid!)} 
                           className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center mx-auto text-xl"
                         >
                           <i className="fa-solid fa-user-minus"></i>
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="bg-jd-light/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-black/40 text-sm font-black uppercase tracking-[0.2em] text-jd-gold border-b border-white/10">
                  <th className="px-10 py-8">意向類型</th>
                  <th className="px-10 py-8">物資品名</th>
                  <th className="px-10 py-8">規模 / 報價</th>
                  <th className="px-10 py-8 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.length === 0 ? (
                  <tr><td colSpan={4} className="py-40 text-center text-gray-600 italic text-2xl font-bold">目前無交易數據</td></tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-8">
                        <span className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${
                          sub.type === 'buyer' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                        }`}>
                          {sub.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-white font-black text-2xl">{sub.commodity}</td>
                      <td className="px-10 py-8 text-white font-mono text-2xl">${sub.price} USD</td>
                      <td className="px-10 py-8 text-center">
                         <button onClick={async () => {
                           if(window.confirm('確定刪除？')) {
                             await dataService.deleteSubmission(sub.id);
                             setSubmissions(s => s.filter(x => x.id !== sub.id));
                           }
                         }} className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xl"><i className="fa-solid fa-trash-can"></i></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-10 pt-48 pb-64">
      {actionMessage && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-500 px-12 py-5 rounded-3xl font-black text-xl bg-jd-gold text-jd-dark shadow-2xl flex items-center gap-4">
          {actionMessage}
        </div>
      )}

      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
            JD MORGAN <span className="text-jd-gold font-light not-italic ml-4">ADMINISTRATION</span>
          </h2>
          <p className="text-gray-500 text-sm uppercase tracking-[0.5em] font-black">Global Node Terminal 1.0 - Full Access Control</p>
        </div>
        <button 
          onClick={() => onNavigate(View.HOME)} 
          className="text-gray-500 hover:text-white text-xl font-black uppercase tracking-widest flex items-center gap-4 transition-colors"
        >
          <i className="fa-solid fa-house"></i> 回到首頁
        </button>
      </div>

      <div className="flex bg-jd-light/30 rounded-3xl p-2 border border-white/5 overflow-x-auto mb-20 shadow-2xl backdrop-blur-md">
        {[ 
          { id: 'data', icon: 'fa-chart-pie', label: '數據總覽' }, 
          { id: 'intelligence', icon: 'fa-microchip', label: '情報管理' },
          { id: 'visual', icon: 'fa-wand-magic-sparkles', label: '視覺控制' }, 
          { id: 'members', icon: 'fa-users-viewfinder', label: '會員矩陣' } 
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-12 py-8 rounded-2xl text-2xl font-black uppercase tracking-widest transition-all flex items-center whitespace-nowrap gap-4 ${
              activeTab === tab.id ? 'bg-jd-gold text-jd-dark shadow-2xl scale-105' : 'text-gray-500 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i> 
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[800px]">{renderTabContent()}</div>

      {/* Persistent Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-[150] p-10 flex justify-center pointer-events-none">
        <div className="max-w-[1200px] w-full bg-jd-light/95 backdrop-blur-3xl border border-jd-gold/30 rounded-[3rem] p-10 flex items-center justify-between gap-10 shadow-[0_-20px_100px_rgba(0,0,0,0.8)] pointer-events-auto">
          <div className="flex items-center gap-6">
            <div className={`w-6 h-6 rounded-full ${isDirty ? 'bg-jd-gold animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]'}`}></div>
            <p className="text-white text-2xl font-black uppercase tracking-widest">
              {isDirty ? '偵測到未同步修改' : '所有數據已與雲端同步'}
            </p>
          </div>
          <button 
            onClick={handlePublish} 
            disabled={isSaving || !isDirty} 
            className={`px-20 py-6 rounded-3xl text-2xl font-black uppercase tracking-[0.2em] transition-all ${
              isDirty 
                ? 'bg-jd-gold text-jd-dark shadow-2xl hover:scale-110 hover:shadow-jd-gold/30' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            {isSaving ? '同步中...' : '發佈最新配置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;