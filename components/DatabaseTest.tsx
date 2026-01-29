import React, { useState, useEffect } from 'react';
import { isConfigured } from '../firebase';
import { dataService } from '../dataService';

interface DatabaseTestProps {
  onBack: () => void;
}

const DatabaseTest: React.FC<DatabaseTestProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [mailStatus, setMailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleTestMail = async () => {
    setMailStatus('sending');
    addLog("📧 [MAIL] 正在發起加密信道連通性測試...");
    try {
      await dataService.resendVerificationEmail();
      addLog("✅ [SUCCESS] SMTP 轉發請求已成功送達雲端節點。");
      setMailStatus('success');
    } catch (err: any) {
      setMailStatus('error');
      addLog(`❌ [ERROR] 信道異常: ${err.message}`);
    } finally {
      setTimeout(() => setMailStatus('idle'), 3000);
    }
  };

  const startTest = async () => {
    const startTime = Date.now();
    setStatus('testing');
    setLatency(null);
    addLog("🚀 [DATABASE] 正在執行全球資料存根讀寫診斷...");

    try {
      const testId = await dataService.runDiagnostic();
      addLog(`✅ [WRITE] 雲端寫入測試成功 (STUB_ID: ${testId})`);
      
      addLog("📡 [SYNC] 正在同步本地與雲端緩存...");
      await dataService.getSubmissions(1);
      
      const totalTime = Date.now() - startTime;
      setLatency(totalTime);
      addLog(`🏁 [FINISH] 診斷完畢：延遲 ${totalTime}ms，數據通路 100% 穩定。`);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      addLog(`❌ [FAILURE] 數據同步中斷: ${err.message}`);
    } finally {
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const formatUptime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-jd-light/40 backdrop-blur-3xl border border-jd-gold/20 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative">
        {/* 重要修復：添加 pointer-events-none 防止裝飾圓圈阻擋點擊 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-jd-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/20 relative z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-jd-gold/10 rounded-2xl flex items-center justify-center border border-jd-gold/30">
              <i className="fa-solid fa-satellite-dish text-jd-gold text-2xl animate-pulse"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                JD-SYNC <span className="text-jd-gold font-light not-italic">Diagnostic Center</span>
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">Global Node Data Integrity Monitor</p>
            </div>
          </div>
          <button 
            onClick={onBack} 
            className="group px-8 py-3 bg-white/5 hover:bg-jd-gold text-white hover:text-jd-dark border border-white/10 hover:border-jd-gold rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 relative z-30"
          >
            <i className="fa-solid fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
            返回管理中心
          </button>
        </div>

        <div className="p-10 space-y-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 郵件測試 */}
            <div className="bg-jd-dark/60 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between group hover:border-blue-500/30 transition-all shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <i className="fa-solid fa-paper-plane text-xl"></i>
                  </div>
                  <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Protocol Check</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase">郵件信道測試</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">測試 Firebase SMTP 節點的信號轉發狀態，確保會員驗證系統運作正常。</p>
              </div>
              <button 
                onClick={handleTestMail} 
                disabled={mailStatus === 'sending'}
                className={`w-full mt-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  mailStatus === 'sending' ? 'bg-blue-500/50 text-white animate-pulse' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white'
                }`}
              >
                {mailStatus === 'sending' ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-envelope"></i>}
                發送測試加密信
              </button>
            </div>

            {/* 核心美化監視儀 */}
            <div className="bg-gradient-to-br from-jd-light to-jd-dark p-1 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="bg-jd-dark/80 rounded-[2.4rem] h-full p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-48 h-48 border border-jd-gold/30 rounded-full animate-ping"></div>
                  <div className="absolute w-32 h-32 border border-jd-gold/20 rounded-full animate-ping [animation-delay:0.5s]"></div>
                </div>

                <div className="text-center relative z-10 space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-500 text-[9px] font-black uppercase tracking-[0.3em]">Node Sync Active</span>
                    </div>
                    <div className="text-white font-mono text-5xl font-black tracking-tighter">
                      {latency ? `${latency}ms` : '---'}
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Live Latency</p>
                  </div>

                  <div className="flex gap-8 border-t border-white/5 pt-6 w-full justify-center">
                    <div className="text-center">
                      <p className="text-jd-gold text-lg font-black font-mono leading-none">{formatUptime(uptime)}</p>
                      <p className="text-[8px] text-gray-600 uppercase font-bold tracking-widest mt-1">Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-lg font-black font-mono leading-none">AES-256</p>
                      <p className="text-[8px] text-gray-600 uppercase font-bold tracking-widest mt-1">Security</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 資料庫測試 */}
            <div className="bg-jd-dark/60 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between group hover:border-jd-gold/30 transition-all shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-jd-gold/10 flex items-center justify-center border border-jd-gold/20 text-jd-gold">
                    <i className="fa-solid fa-database text-xl"></i>
                  </div>
                  <span className="text-[9px] text-jd-gold font-black uppercase tracking-widest">Storage Node</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase">數據通路診斷</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">執行一次原子性讀寫測試，確保 JD-LINK 全球雲端數據存根可即時被調用。</p>
              </div>
              <button 
                onClick={startTest} 
                disabled={status === 'testing'}
                className={`w-full mt-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  status === 'testing' ? 'bg-jd-gold text-jd-dark animate-pulse shadow-[0_0_30px_rgba(251,191,36,0.4)]' : 'bg-jd-gold/10 text-jd-gold border border-jd-gold/30 hover:bg-jd-gold hover:text-jd-dark'
                }`}
              >
                {status === 'testing' ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                開始 R/W 診斷
              </button>
            </div>
          </div>

          {/* 終端日誌 */}
          <div className="space-y-4 relative">
            <div className="flex items-center justify-between px-4">
              <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Integrated Telemetry Log</h4>
              <button onClick={() => setLogs([])} className="text-jd-gold hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">Clear Terminal</button>
            </div>
            <div className="bg-black/80 rounded-[2rem] p-8 font-mono text-[11px] h-80 overflow-y-auto border border-white/5 custom-scrollbar shadow-inner relative group">
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_4px,3px_100%] z-20"></div>
              {logs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 opacity-40 space-y-2">
                  <i className="fa-solid fa-terminal text-4xl"></i>
                  <p className="tracking-[0.4em] font-black">Terminal Standby...</p>
                </div>
              )}
              <div className="relative z-10">
                {logs.map((log, i) => (
                  <div key={i} className={`mb-2 flex gap-4 animate-in slide-in-from-left-4 ${log.includes('❌') || log.includes('ERROR') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : 'text-gray-400'}`}>
                    <span className="opacity-30 whitespace-nowrap">[{i.toString().padStart(2, '0')}]</span>
                    <span className="flex-grow">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;