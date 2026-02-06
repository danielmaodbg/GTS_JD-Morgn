import React, { useState, useEffect } from 'react';
import { View, User, TradeConfig, AppConfig, TradeSubmission, MemberType, Language } from './types';
import { INITIAL_CONFIG, INITIAL_APP_CONFIG, INITIAL_SUBMISSIONS, MOCK_USERS } from './constants';
import { translations } from './translations';
import Navbar from './components/Navbar';
import HomeNew from './components/HomeNew';
import Login from './components/Login';
import RoleSelection from './components/RoleSelection';
import TradeForm from './components/TradeForm';
import AdminDashboard from './components/AdminDashboard';
import EntryModal from './components/EntryModal';
import MemberDashboard from './components/MemberDashboard';
import DatabaseTest from './components/DatabaseTest';
import EmailVerification from './components/EmailVerification';
import News from './components/News';
import Disclaimer from './components/Disclaimer';
import LegalGate from './components/LegalGate';
import FraudReport from './components/FraudReport';
import { dataService } from './dataService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(Language.ZH);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [config, setConfig] = useState<TradeConfig>(INITIAL_CONFIG);
  const [appConfig, setAppConfig] = useState<AppConfig>(INITIAL_APP_CONFIG);
  const [submissions, setSubmissions] = useState<TradeSubmission[]>(INITIAL_SUBMISSIONS);
  const [members, setMembers] = useState<User[]>(MOCK_USERS);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isLegalAgreed, setIsLegalAgreed] = useState<boolean | null>(null);

  const t = translations[language];

  useEffect(() => {
    const agreed = localStorage.getItem('jd_morgan_legal_agreed');
    setIsLegalAgreed(agreed === 'true');

    const loadConfig = async () => {
      try {
        const savedConfig = await dataService.getSettings();
        if (savedConfig) setAppConfig(savedConfig);
      } catch (err) { console.error("Config load failed", err); }
    };
    loadConfig();

    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLegalAgree = () => {
    localStorage.setItem('jd_morgan_legal_agreed', 'true');
    setIsLegalAgreed(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.HOME);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.HOME: return <HomeNew onStart={() => setIsEntryModalOpen(true)} onNavigate={setCurrentView} config={appConfig} language={language} />;
      case View.LOGIN: return <Login onLogin={setCurrentUser} onRegisterSuccess={setPendingEmail} />;
      case View.NEWS: return <News onBack={() => setCurrentView(View.HOME)} />;
      case View.MEMBER_DASHBOARD: return currentUser ? <MemberDashboard user={currentUser} onNavigate={setCurrentView} language={language} /> : <HomeNew onStart={() => setIsEntryModalOpen(true)} onNavigate={setCurrentView} config={appConfig} language={language} />;
      case View.ADMIN: return <AdminDashboard config={config} setConfig={setConfig} appConfig={appConfig} setAppConfig={setAppConfig} submissions={submissions} setSubmissions={setSubmissions} members={members} setMembers={setMembers} onNavigate={setCurrentView} />;
      case View.DISCLAIMER: return <Disclaimer onBack={() => setCurrentView(View.HOME)} />;
      case View.FRAUD_REPORT: return <FraudReport onBack={() => setCurrentView(View.HOME)} />;
      default: return <HomeNew onStart={() => setIsEntryModalOpen(true)} onNavigate={setCurrentView} config={appConfig} language={language} />;
    }
  };

  const showLegalGate = isLegalAgreed !== true;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-jd-dark text-white">
      {showLegalGate && <LegalGate onAgree={handleLegalAgree} />}
      
      <Navbar 
        currentUser={currentUser} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout}
        isScrolled={isScrolled}
        config={appConfig}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-jd-dark border-t border-white/10 pt-32 pb-16 relative z-10">
        <div className="max-w-[1600px] mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-24">
            {/* Identity - Updated per Screenshot Request */}
            <div className="flex flex-col items-center md:items-start space-y-10">
              <div className="flex items-start gap-8">
                {/* Logo Icon */}
                <div className="w-20 h-20 bg-jd-gold/10 rounded-full flex items-center justify-center border border-jd-gold/30 shrink-0">
                  <i className="fa-solid fa-earth-americas text-jd-gold text-4xl"></i>
                </div>
                
                {/* Text and Regional Links Stacked Vertically */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-white font-black text-6xl tracking-tighter uppercase leading-none">JD MORGAN</h3>
                  
                  {/* Regional Switcher - Placed directly under JD MORGAN text */}
                  <div className="flex items-center gap-3 p-2 px-4 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-md w-fit">
                    <a 
                      href="https://gts-jd-morgn.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-white hover:text-jd-gold transition-all font-black uppercase tracking-widest"
                    >
                      北美
                    </a>
                    <span className="w-px h-4 bg-white/30"></span>
                    <a 
                      href="https://jdmorgan.ca" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-white hover:text-jd-gold transition-all font-black uppercase tracking-widest"
                    >
                      亞太
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.4em] pt-4">
                VANCOUVER HQ: SUITE 1500, WEST GEORGIA ST.
              </p>
            </div>

            {/* Sitemap */}
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-10">
                <h4 className="text-jd-gold font-black text-sm uppercase tracking-[0.6em] border-b border-jd-gold/30 pb-4 inline-block">{t.sitemap_platform}</h4>
                <div className="flex flex-col gap-6 text-sm font-black uppercase tracking-[0.3em] text-gray-500">
                  <button onClick={() => setCurrentView(View.HOME)} className="hover:text-white transition-all text-left">情報對接</button>
                  <button onClick={() => setCurrentView(View.NEWS)} className="hover:text-white transition-all text-left">市場觀察</button>
                  <button onClick={() => setCurrentView(View.NEWS)} className="hover:text-white transition-all text-left">產業情報</button>
                </div>
              </div>
              <div className="space-y-10">
                <h4 className="text-jd-gold font-black text-sm uppercase tracking-[0.6em] border-b border-jd-gold/30 pb-4 inline-block">{t.sitemap_legal}</h4>
                <div className="flex flex-col gap-6 text-sm font-black uppercase tracking-[0.3em] text-gray-500">
                  <button onClick={() => setCurrentView(View.DISCLAIMER)} className="hover:text-white transition-all text-left">隱私政策</button>
                  <button onClick={() => setCurrentView(View.DISCLAIMER)} className="hover:text-white transition-all text-left">服務條款</button>
                  <button onClick={() => setCurrentView(View.DISCLAIMER)} className="hover:text-white transition-all text-left">法律免責</button>
                </div>
              </div>
            </div>
          </div>

          {/* Large Fraud Report Button */}
          <div className="flex justify-center mb-24">
            <button 
              onClick={() => setCurrentView(View.FRAUD_REPORT)} 
              className="w-full max-w-2xl py-12 border-4 border-white rounded-[3rem] text-2xl font-black text-white uppercase tracking-[0.5em] hover:bg-jd-gold hover:text-white transition-all shadow-[0_0_100px_rgba(239,68,68,0.3)] flex items-center justify-center gap-10 group"
            >
              <i className="fa-solid fa-shield-halved group-hover:scale-110 transition-transform"></i> 
              詐欺舉報
            </button>
          </div>

          <div className="pt-12 border-t border-white/10 text-center">
            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.8em]">COPYRIGHT © 2026 JD MORGAN GROUP. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      <EntryModal 
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSelectGuest={() => setCurrentView(View.ROLE_SELECT)}
        onSelectMember={() => setCurrentView(View.LOGIN)}
        language={language}
      />
    </div>
  );
};

export default App;