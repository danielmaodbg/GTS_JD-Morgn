import React, { useState } from 'react';
import { isConfigured, firebaseConfig } from '../firebase';
import { dataService } from '../dataService';

interface DatabaseTestProps {
  onBack: () => void;
}

const DatabaseTest: React.FC<DatabaseTestProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [mailStatus, setMailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [purgeStatus, setPurgeStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [purgeSubStatus, setPurgeSubStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [isAdminRestoring, setIsAdminRestoring] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleRestoreAdmin = async () => {
    setIsAdminRestoring(true);
    addLog("🛠️ [RECOVERY] 正在啟動管理者帳號恢復程序...");
    try {
      const uid = await dataService.initializeAdmin();
      addLog(`✅ [SUCCESS] 管理者帳號 (info@jdmorgan.ca) 已成功同步。 UID: ${uid}`);
      alert("管理者帳號已恢復！\n帳號: info@jdmorgan.ca\n密碼: 123456");
    } catch (err: any) {
      addLog(`❌ [ERROR] 恢復失敗: ${err.message}`);
    } finally {
      setIsAdminRestoring(false);
    }
  };

  const handleTestMail = async () => {
    setMailStatus('sending');
    addLog("📧 [MAIL] 正在發起郵件通路測試：向當端發送驗證信...");
    try {
      await dataService.resendVerificationEmail();
      addLog("✅ [SUCCESS] Firebase 已成功接收發信請求。");
      setMailStatus('success');
    } catch (err: any) {
      setMailStatus('error');
      addLog(`❌ [ERROR] 郵件發送失敗: ${err.message}`);
    }
  };

  const handlePurgeUnverified = async (forceAll: boolean) => {
    if (forceAll && !confirm("⚠️ 警告：這將強制刪除資料庫中「所有」待驗證的會員信箱。確定執行？")) return;
    setPurgeStatus('processing');
    try {
      await dataService.purgeUnverifiedUsers((msg) => addLog(msg), forceAll);
      setPurgeStatus('success');
    } catch (err: any) {
      setPurgeStatus('error');
      addLog(`❌ [FATAL] 清理中斷: ${err.message}`);
    } finally {
      setTimeout(() => setPurgeStatus('idle'), 2000);
    }
  };

  const handlePurgeSubmissions = async () => {
    if (!confirm("⚠️ 警告：這將永久刪除所有交易申請 (LOI/SCO)。確定執行？")) return;
    setPurgeSubStatus('processing');
    try {
      await dataService.purgeAllSubmissions((msg) => addLog(msg));
      setPurgeSubStatus('success');
    } catch (err: any) {
      setPurgeSubStatus('error');
      addLog(`❌ [FATAL] 銷毀失敗: ${err.message}`);
    } finally {
      setTimeout(() => setPurgeSubStatus('idle'), 2000);
    }
  };

  const handleClearLogs = async () => {
    addLog("🧹 [LOCAL] 正在清理診斷終端日誌緩存...");
    setLogs([]);
    try {
      await dataService.purgeDiagnostics();
      addLog("✅ [CLOUD] 雲端診斷日誌已同步清理。");
    } catch (e) {}
  };

  const startTest = async () => {
    const startTime = Date.now();
    setStatus('testing');
    setLatency(null);
    addLog("🚀 [DIAGNOSTIC] 正在穿透雲端節點，發起數據吞吐測試...");

    try {
      const testId = await dataService.runDiagnostic();
      const writeTime = Date.now() - startTime;
      addLog(`✅ [WRITE] 核心連線寫入成功 (Latency: ${writeTime}ms) - UID: ${testId}`);
      
      addLog("📡 [SYNC] 正在同步全球交易情報存根...");
      await dataService.getSubmissions(1);
      
      const totalTime = Date.now() - startTime;
      setLatency(totalTime);
      addLog(`🏁 [FINISH] 診斷完畢：通路邏輯通暢。`);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      addLog(`❌ [FAILURE] 致命錯誤: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-32 animate-in fade-in duration-700">
      <div className="bg-jd-light/40 backdrop-blur-xl border border-jd-gold/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-jd-dark/40">
          <div>
            <h2 className="text-2xl font-black text-white italic flex items-center leading-none">
              <i className="fa-solid fa-satellite-dish mr-3 text-jd-gold animate-pulse"></i>
              JD-LINK 數據通路診斷終端
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-jd-gold border border-jd-gold/30 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-jd-gold hover:text-jd-dark transition-all">
              返回管理中心
            </button>
          </div>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-jd-dark/60 p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-3">帳號修復</p>
              <button onClick={handleRestoreAdmin} disabled={isAdminRestoring} className="w-full bg-jd-dark border border-jd-gold/50 hover:bg-jd-gold hover:text-jd-dark text-jd-gold py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                {isAdminRestoring ? <i className="fa-solid fa-spinner animate-spin"></i> : "恢復 Admin"}
              </button>
            </div>

            <div className="bg-jd-dark/60 p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-3">信道測試</p>
              <button onClick={handleTestMail} className="w-full bg-jd-dark border border-blue-500/50 hover:bg-blue-500 hover:text-white text-blue-400 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                {mailStatus === 'sending' ? <i className="fa-solid fa-spinner animate-spin"></i> : "發送測試信"}
              </button>
            </div>

            <div className="bg-jd-dark/60 p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-red-500/70 uppercase font-black mb-3">清空未驗證(NOW)</p>
              <button onClick={() => handlePurgeUnverified(true)} className="w-full bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                {purgeStatus === 'processing' ? <i className="fa-solid fa-spinner animate-spin"></i> : "刪除所有等待驗證"}
              </button>
            </div>

            <div className="bg-jd-dark/60 p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-red-500/70 uppercase font-black mb-3">意向清理</p>
              <button onClick={handlePurgeSubmissions} className="w-full bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                {purgeSubStatus === 'processing' ? <i className="fa-solid fa-spinner animate-spin"></i> : "清除交易件"}
              </button>
            </div>
            
            <button onClick={startTest} disabled={status === 'testing'} className="bg-jd-gold hover:bg-yellow-500 text-jd-dark rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex flex-col items-center justify-center gap-2 py-4 shadow-xl">
              {status === 'testing' ? <i className="fa-solid fa-circle-notch animate-spin text-2xl"></i> : <i className="fa-solid fa-bolt text-2xl"></i>}
              數據庫測試
            </button>
          </div>

          <div className="relative">
            <button onClick={handleClearLogs} className="absolute top-4 right-6 text-gray-500 hover:text-jd-gold transition-colors text-[10px] font-black uppercase tracking-widest z-10">清空終端</button>
            <div className="bg-black/60 rounded-3xl p-8 font-mono text-[11px] h-96 overflow-y-auto border border-white/5 custom-scrollbar shadow-inner">
              {logs.length === 0 && <div className="text-gray-700 italic opacity-50 tracking-widest">JD-LINK TERMINAL READY. AWAITING COMMAND...</div>}
              {logs.map((log, i) => (
                <div key={i} className={`mb-2 animate-in slide-in-from-left-2 duration-300 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : log.includes('[INFO]') ? 'text-blue-400' : 'text-gray-400'}`}>
                  <span className="text-jd-gold/40 mr-2">»</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;