import React, { useState, useEffect, useCallback } from 'react';
import { TradeConfig, AppConfig, TradeSubmission, User, MemberType, HeroSlide, View } from '../types';
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
  const [activeTab, setActiveTab] = useState<'visual' | 'members' | 'data'>('data');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDirty, setIsDirty] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    password: '',
    country: 'Singapore',
    memberType: MemberType.REGULAR
  });

  const showActionFeedback = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const runHousekeeping = useCallback(async () => {
    try {
      console.log("Starting Auto-Housekeeping...");
      await dataService.purgeUnverifiedUsers((msg) => {
        if (msg.includes('SUCCESS')) showActionFeedback("🧹 系統維護：已自動移除過期未驗證帳號");
      }, false);
    } catch (e) {}
  }, []);

  const fetchData = useCallback(async (showLoader: boolean = true) => {
    if (showLoader) setIsFetching(true);
    try {
      if (activeTab === 'data') {
        const subs = await dataService.getSubmissions();
        setSubmissions(subs);
      } else if (activeTab === 'members') {
        const users = await dataService.getAllUsers();
        setMembers(users);
      } else if (activeTab === 'visual') {
        const cloudConfig = await dataService.getSettings();
        setAppConfig(cloudConfig);
        setIsDirty(false);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Auto-sync failed:", err);
    } finally {
      if (showLoader) setIsFetching(false);
    }
  }, [activeTab, setSubmissions, setMembers, setAppConfig]);

  useEffect(() => {
    fetchData(true);
    // 管理員登入後執行一次數據維護
    runHousekeeping();
  }, [fetchData, runHousekeeping]);

  useEffect(() => {
    if (activeTab === 'data' || activeTab === 'members') {
      const interval = setInterval(() => {
        fetchData(false); 
      }, 15000); 
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchData]);

  const updateAppConfig = (updates: Partial<AppConfig>) => {
    setAppConfig(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleUpdateSlide = (id: string, updates: Partial<HeroSlide>) => {
    const newSlides = appConfig.heroSlides.map(s => s.id === id ? { ...s, ...updates } : s);
    updateAppConfig({ heroSlides: newSlides });
  };

  const handleAddSlide = () => {
    const newId = `slide_${Date.now()}`;
    const newSlide: HeroSlide = {
      id: newId,
      img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop',
      title: '新交易標題',
      subtitle: '新交易副標題描述文字',
      order: appConfig.heroSlides.length + 1
    };
    updateAppConfig({ heroSlides: [...appConfig.heroSlides, newSlide] });
  };

  const handleRemoveSlide = (id: string) => {
    if (appConfig.heroSlides.length <= 1) {
      alert("系統必須至少保留一組輪播圖片。");
      return;
    }
    if (!window.confirm("確定要移除此組輪播視覺嗎？")) return;
    const newSlides = appConfig.heroSlides.filter(s => s.id !== id);
    updateAppConfig({ heroSlides: newSlides });
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("圖片大小請限制在 2MB 以內。");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleUpdateSlide(id, { img: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await dataService.saveSettings(appConfig);
      setSaveStatus('success');
      setIsDirty(false);
      showActionFeedback("🚀 雲端視覺節點廣播成功！已即時生效。");
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error("Publish failed:", err);
      setSaveStatus('error');
      alert(`發佈失敗：${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (e: React.MouseEvent, targetUid: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const safeUid = String(targetUid || '').trim();
    if (!safeUid) {
      alert("❌ 無法識別該會員 ID，請嘗試刷新頁面。");
      return;
    }

    if (!window.confirm('🚨 確定要永久移除此會員檔案嗎？此動作將會從資料庫中物理刪除檔案。')) {
      return;
    }
    
    try {
      const success = await dataService.deleteUser(safeUid);
      if (success) {
        setMembers(prev => prev.filter(m => String(m.uid || m.id) !== safeUid));
        showActionFeedback("✅ 會員數據已從節點銷毀: PURGED");
      } else {
        alert("❌ 刪除失敗，請檢查權限。");
      }
    } catch (err: any) {
      console.error("Delete failure:", err);
      alert(`刪除失敗：${err.message}`);
    }
  };

  const handleDeleteSubmission = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    if (!window.confirm('🚨 確定要刪除此筆交易意向數據嗎？')) return;
    try {
      const success = await dataService.deleteSubmission(id);
      if (success) {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        showActionFeedback("🗑️ 交易紀錄已銷毀: DELETED");
      }
    } catch (err: any) {
      alert(`數據刪除失敗：${err.message}`);
    }
  };

  const handleRoleChange = async (userId: string, newType: MemberType) => {
    if (!userId) return;
    try {
      await dataService.updateUserRole(userId, newType);
      setMembers(prev => prev.map(m => String(m.uid || m.id) === userId ? { ...m, memberType: newType } : m));
    } catch (err) {
      alert('權限變更失敗。');
    }
  };

  const handleToggleApproval = async (userId: string, currentStatus: boolean) => {
    if (!userId) return;
    try {
      await dataService.toggleUserApproval(userId, !currentStatus);
      setMembers(prev => prev.map(m => String(m.uid || m.id) === userId ? { ...m, isApproved: !currentStatus } : m));
    } catch (err) {
      alert('審核狀態更新失敗。');
    }
  };

  const handleQuickAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newUser = await dataService.adminCreateUser({
        name: newMemberData.name,
        email: newMemberData.email,
        country: newMemberData.country,
        memberType: newMemberData.memberType,
        role: 'client'
      }, newMemberData.password);
      
      setMembers(prev => [newUser as User, ...prev]);
      setIsAddMemberModalOpen(false);
      setNewMemberData({ name: '', email: '', password: '', country: 'Singapore', memberType: MemberType.REGULAR });
      showActionFeedback("👤 新會員已成功載入雲端節點");
    } catch (err: any) {
      alert(`新增失敗: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    if (isFetching) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-jd-gold/20 border-t-jd-gold rounded-full animate-spin"></div>
          <p className="text-jd-gold text-xs font-black uppercase tracking-[0.3em]">Synchronizing Cloud Data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'data':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-jd-light/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-jd-gold border-b border-white/5">
                    <th className="px-8 py-6">意向類型</th>
                    <th className="px-8 py-6">物資品名</th>
                    <th className="px-8 py-6">規模 / 報價</th>
                    <th className="px-8 py-6">聯繫主體</th>
                    <th className="px-8 py-6">憑證</th>
                    <th className="px-8 py-6">時間節點</th>
                    <th className="px-8 py-6 text-center">管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.length === 0 ? (
                    <tr><td colSpan={7} className="px-8 py-24 text-center text-gray-500 italic">目前全球節點無待處理數據</td></tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${sub.type === 'buyer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                            {sub.type === 'buyer' ? 'LOI 採購' : 'SCO 供貨'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-white font-bold text-base">{sub.commodity}</td>
                        <td className="px-8 py-6">
                          <p className="text-white text-sm font-mono">{sub.quantity}</p>
                          <p className="text-jd-gold text-[10px] font-mono mt-1">${sub.price} USD / UNIT</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-white font-bold">{sub.clientName}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{sub.contactEmail}</p>
                        </td>
                        <td className="px-8 py-6">
                          {sub.fileData ? (
                            <button className="text-jd-gold hover:text-white transition-colors flex items-center gap-2">
                              <i className="fa-solid fa-file-shield text-xl"></i>
                              <span className="text-[9px] font-black uppercase tracking-tighter">檢視文件</span>
                            </button>
                          ) : <span className="text-gray-700 text-[10px]">無附件</span>}
                        </td>
                        <td className="px-8 py-6 text-gray-500 text-[10px] font-mono whitespace-nowrap">
                          {new Date(sub.timestamp).toLocaleString()}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button 
                            type="button"
                            onClick={(e) => handleDeleteSubmission(e, sub.id)}
                            className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 border border-red-500/20 flex items-center justify-center mx-auto transition-all pointer-events-auto shadow-sm active:scale-90"
                          >
                            <i className="fa-solid fa-trash-can text-sm"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end mb-6">
               <button 
                type="button"
                onClick={() => setIsAddMemberModalOpen(true)}
                className="bg-jd-gold/10 hover:bg-jd-gold text-jd-gold hover:text-jd-dark border border-jd-gold/30 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(251,191,36,0.1)] pointer-events-auto"
               >
                 <i className="fa-solid fa-user-plus mr-2"></i> 快速新增會員
               </button>
            </div>
            <div className="bg-jd-light/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-jd-gold border-b border-white/5">
                    <th className="px-8 py-6">會員編號</th>
                    <th className="px-8 py-6">名稱 / 郵箱</th>
                    <th className="px-8 py-6">身分權限</th>
                    <th className="px-8 py-6">審核狀態</th>
                    <th className="px-8 py-6 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((member) => (
                    <tr key={String(member.uid || member.id)} className="hover:bg-white/5 transition-all group">
                      <td className="px-8 py-6">
                        <span className="font-mono text-jd-gold text-sm font-black tracking-widest bg-jd-gold/5 px-3 py-1.5 rounded border border-jd-gold/10">
                          {member.memberId || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-white font-black text-base">{member.name || member.username}</span>
                          <span className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-wider">{member.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <select 
                          value={member.memberType || MemberType.REGULAR}
                          onChange={(e) => handleRoleChange(String(member.uid || member.id), e.target.value as MemberType)}
                          className="bg-jd-dark border border-gray-800 rounded-lg px-4 py-2 text-xs text-jd-gold font-black outline-none focus:border-jd-gold cursor-pointer"
                        >
                          {Object.values(MemberType).map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          type="button"
                          onClick={() => handleToggleApproval(String(member.uid || member.id), !!member.isApproved)}
                          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all pointer-events-auto ${
                            member.isApproved 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500 hover:text-jd-dark'
                          }`}
                        >
                          {member.isApproved ? <><i className="fa-solid fa-check-double mr-2"></i>已核准</> : <><i className="fa-solid fa-user-clock mr-2"></i>手動授權</>}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button 
                          type="button"
                          onClick={(e) => handleDeleteMember(e, member.uid || member.id)}
                          className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center mx-auto shadow-sm pointer-events-auto active:scale-90"
                          title="移除此會員檔案"
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

      case 'visual':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="bg-jd-light/40 p-8 rounded-3xl border border-white/5 space-y-6 shadow-xl">
              <h3 className="text-jd-gold text-sm font-black uppercase tracking-widest flex items-center">
                <i className="fa-solid fa-fingerprint mr-3"></i> 品牌身份識別
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Logo 顯示文字</label>
                  <input 
                    type="text" 
                    value={appConfig.logoText} 
                    onChange={(e) => updateAppConfig({ logoText: e.target.value })}
                    className="w-full bg-jd-dark border border-gray-800 rounded-xl p-4 text-white focus:border-jd-gold outline-none font-black text-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">品牌圖標 (FontAwesome Code)</label>
                  <input 
                    type="text" 
                    value={appConfig.logoIcon} 
                    onChange={(e) => updateAppConfig({ logoIcon: e.target.value })}
                    className="w-full bg-jd-dark border border-gray-800 rounded-xl p-4 text-white focus:border-jd-gold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-jd-gold text-sm font-black uppercase tracking-widest flex items-center">
                  <i className="fa-solid fa-images mr-3"></i> 核心視覺輪播管理
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase">共 {appConfig.heroSlides.length} 組內容</span>
              </div>
              
              <div className="space-y-6">
                {appConfig.heroSlides.map((slide, idx) => (
                  <div key={slide.id} className="group bg-jd-light/40 p-8 rounded-3xl border border-white/5 grid grid-cols-1 lg:grid-cols-4 gap-10 relative shadow-xl hover:border-jd-gold/20 transition-all">
                    <button 
                      type="button"
                      onClick={() => handleRemoveSlide(slide.id)}
                      className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 border border-red-500/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 pointer-events-auto"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>

                    <div className="lg:col-span-1 space-y-4">
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-black relative group shadow-inner">
                        <img src={slide.img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <p className="text-white text-[10px] font-black uppercase tracking-widest">替換圖片</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(slide.id, e)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] font-black text-jd-gold/40 uppercase tracking-widest">SLIDE #{idx + 1}</span>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-3 grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">主標題內容</label>
                        <input 
                          type="text" 
                          value={slide.title} 
                          onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                          className="w-full bg-jd-dark border border-gray-800 rounded-xl p-4 text-white focus:border-jd-gold outline-none font-bold text-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">副標題 / 描述性文本</label>
                        <input 
                          type="text" 
                          value={slide.subtitle} 
                          onChange={(e) => handleUpdateSlide(slide.id, { subtitle: e.target.value })}
                          className="w-full bg-jd-dark border border-gray-800 rounded-xl p-4 text-white focus:border-jd-gold outline-none text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={handleAddSlide}
                  className="w-full py-12 rounded-3xl border-2 border-dashed border-white/5 hover:border-jd-gold/30 hover:bg-jd-gold/5 text-gray-600 hover:text-jd-gold transition-all flex flex-col items-center justify-center gap-4 group pointer-events-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-jd-gold/10 flex items-center justify-center transition-all">
                    <i className="fa-solid fa-plus text-3xl"></i>
                  </div>
                  <span className="text-sm font-black uppercase tracking-[0.3em]">新增視覺輪播組件</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-48">
      {actionMessage && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-500">
           <div className={`px-8 py-3 rounded-full font-black text-sm shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 ${
             actionMessage.includes('PURGED') || actionMessage.includes('維護') ? 'bg-red-600 text-white' : 'bg-jd-gold text-jd-dark'
           }`}>
             {actionMessage}
           </div>
        </div>
      )}

      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-jd-dark/90 backdrop-blur-md" onClick={() => setIsAddMemberModalOpen(false)}></div>
           <div className="relative w-full max-w-lg bg-jd-light border border-jd-gold/20 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
             <div className="p-8 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-white italic uppercase">新增核心會員</h3>
                  <p className="text-jd-gold text-[10px] font-black uppercase tracking-widest mt-1">Manual Member Provisioning</p>
                </div>
                
                <form onSubmit={handleQuickAddMember} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={newMemberData.name}
                      onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                      className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-white focus:border-jd-gold outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={newMemberData.email}
                      onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})}
                      className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-white focus:border-jd-gold outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Default Password</label>
                    <input 
                      type="password" 
                      required
                      value={newMemberData.password}
                      onChange={(e) => setNewMemberData({...newMemberData, password: e.target.value})}
                      className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-white focus:border-jd-gold outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-jd-gold uppercase tracking-widest mb-1.5">Initial Permission Level</label>
                    <select 
                      value={newMemberData.memberType}
                      onChange={(e) => setNewMemberData({...newMemberData, memberType: e.target.value as MemberType})}
                      className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-white focus:border-jd-gold outline-none text-sm font-bold cursor-pointer"
                    >
                      {Object.values(MemberType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsAddMemberModalOpen(false)}
                      className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-gray-500 font-bold hover:text-white transition-all pointer-events-auto"
                    >
                      取消
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 bg-jd-gold text-jd-dark font-black px-6 py-4 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 pointer-events-auto"
                    >
                      {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-user-plus"></i>}
                      確認新增
                    </button>
                  </div>
                </form>
             </div>
           </div>
        </div>
      )}

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter">
            JD MORGAN <span className="text-jd-gold font-light not-italic ml-2">CORE ADMINISTRATION</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Node Security & Visual Override Terminal</p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                最後同步: {lastRefreshed.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => fetchData(true)}
          disabled={isFetching}
          className="flex items-center gap-2 text-jd-gold hover:text-white transition-colors px-4 py-2 rounded-lg border border-jd-gold/20 hover:border-jd-gold/50 bg-jd-gold/5 text-[10px] font-black uppercase tracking-widest pointer-events-auto shadow-sm"
        >
          <i className={`fa-solid fa-arrows-rotate ${isFetching ? 'animate-spin' : ''}`}></i>
          強制刷新數據
        </button>
      </div>

      <div className="flex bg-jd-light rounded-2xl p-1 border border-white/5 overflow-x-auto max-w-full mb-10 shadow-2xl">
        {[
          { id: 'data', icon: 'fa-chart-pie', label: '交易大數據' },
          { id: 'visual', icon: 'fa-wand-magic-sparkles', label: '視覺感知控制' },
          { id: 'members', icon: 'fa-users-viewfinder', label: '核心會員矩陣' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-10 py-5 rounded-xl text-xl font-black uppercase tracking-widest transition-all flex items-center whitespace-nowrap leading-none pointer-events-auto ${
              activeTab === tab.id ? 'bg-jd-gold text-jd-dark shadow-[0_10px_30px_rgba(251,191,36,0.3)]' : 'text-gray-500 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-3`}></i> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 p-6 flex justify-center pointer-events-none">
        <div className="max-w-5xl w-full bg-jd-light/90 backdrop-blur-2xl border border-jd-gold/30 rounded-2xl p-6 flex items-center justify-between gap-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
          <div className="flex items-center gap-8">
            <div className={`w-4 h-4 rounded-full ${isDirty ? 'bg-jd-gold animate-pulse shadow-[0_0_15px_rgba(251,191,36,1)]' : 'bg-green-500'}`}></div>
            <div>
              <p className="text-white text-lg font-black uppercase tracking-widest leading-none">
                {isDirty ? '本地節點已修改' : '數據庫完全同步'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              type="button"
              onClick={() => onNavigate(View.DATABASE_TEST)}
              className="px-8 py-4 rounded-xl border border-jd-gold/40 text-jd-gold hover:bg-jd-gold/10 transition-all flex items-center text-xl font-black uppercase tracking-widest leading-none pointer-events-auto"
            >
              通路診斷
            </button>
            <button 
              type="button"
              onClick={handlePublish}
              disabled={isSaving || (!isDirty && saveStatus !== 'error')}
              className={`px-14 py-4 rounded-xl text-xl font-black uppercase tracking-widest transition-all flex items-center shadow-2xl leading-none pointer-events-auto ${
                saveStatus === 'success' ? 'bg-green-600 text-white' : 
                saveStatus === 'error' ? 'bg-red-600 text-white' :
                isDirty ? 'bg-jd-gold text-jd-dark hover:scale-105' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {isSaving ? <i className="fa-solid fa-spinner animate-spin mr-3"></i> : <i className="fa-solid fa-cloud-arrow-up mr-3"></i>}
              {isSaving ? '正在廣播數據...' : saveStatus === 'error' ? '重試發佈' : '確認發佈'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;