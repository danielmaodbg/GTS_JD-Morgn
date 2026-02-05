import React, { useState, useEffect } from 'react';
import { View, User, TradeConfig, AppConfig, TradeSubmission, MemberType, Language } from './types';
import { INITIAL_CONFIG, INITIAL_APP_CONFIG, INITIAL_SUBMISSIONS, MOCK_USERS } from './constants';
import { translations } from './translations';
import Navbar from './components/Navbar';
import HomeNew from './components/HomeNew';
import HomeLegacy from './components/HomeLegacy';
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
  const ADMIN_EMAIL = "info@jdmorgan.ca";

  useEffect(() => {
    const agreed = localStorage.getItem('jd_morgan_legal_agreed');
    setIsLegalAgreed(agreed === 'true');

    const loadConfig = async () => {
      try {
        const savedConfig = await dataService.getSettings();
        if (savedConfig) {
          setAppConfig(savedConfig);
        }
      } catch (err) {
        console.error("Failed to load initial config", err);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLegalAgree = () => {
    localStorage.setItem('jd_morgan_legal_agreed', 'true');
    setIsLegalAgreed(true);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsEntryModalOpen(false);
    const isAdmin = (
      user.role?.toLowerCase() === 'admin' || 
      user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      user.username?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      user.memberType === MemberType.ADMIN ||
      user.memberType === MemberType.PROJECT_MANAGER
    );
    if (isAdmin) {
      setCurrentView(View.ADMIN);
    } else {
      setCurrentView(View.MEMBER_DASHBOARD);
    }
  };

  const handleRegisterSuccess = (email: string) => {
    setPendingEmail(email);
    setCurrentView(View.VERIFY_EMAIL);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.HOME);
  };

  const startTrading = () => {
    setIsEntryModalOpen(true);
  };

  const handleSelectGuest = async () => {
    setIsEntryModalOpen(false);
    try {
      await dataService.signInAnonymously();
    } catch (e) {
      console.warn("Guest session failed, but proceeding...");
    }
    setCurrentView(View.ROLE_SELECT);
  };

  const handleSelectMember = () => {
    setIsEntryModalOpen(false);
    setCurrentView(View.LOGIN);
  };

  const handleAddSubmission = (sub: Omit<TradeSubmission, 'id' | 'timestamp' | 'status'>) => {
    const newSub: TradeSubmission = {
      ...sub,
      id: `sub_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      status: 'Pending'
    };
    setSubmissions([newSub, ...submissions]);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.HOME:
        return <HomeNew onStart={startTrading} onNavigate={setCurrentView} config={appConfig} language={language} />;
      case View.HOME_LEGACY:
        return <HomeLegacy onStart={startTrading} config={appConfig} />;
      case View.LOGIN:
        return <Login onLogin={handleLogin} onRegisterSuccess={handleRegisterSuccess} />;
      case View.VERIFY_EMAIL:
        return <EmailVerification email={pendingEmail} onContinue={() => setCurrentView(View.LOGIN)} />;
      case View.ROLE_SELECT:
        return <RoleSelection onSelect={(role) => setCurrentView(role === 'buyer' ? View.BUYER_FORM : View.SELLER_FORM)} />;
      case View.BUYER_FORM:
        return <TradeForm 
          role="buyer" 
          config={config} 
          currentUser={currentUser}
          onBack={() => currentUser ? setCurrentView(View.MEMBER_DASHBOARD) : setCurrentView(View.ROLE_SELECT)} 
          onSuccess={(data) => {
            handleAddSubmission({ ...data, type: 'buyer' });
            setCurrentView(View.HOME);
          }} 
        />;
      case View.SELLER_FORM:
        return <TradeForm 
          role="seller" 
          config={config} 
          currentUser={currentUser}
          onBack={() => currentUser ? setCurrentView(View.MEMBER_DASHBOARD) : setCurrentView(View.ROLE_SELECT)} 
          onSuccess={(data) => {
            handleAddSubmission({ ...data, type: 'seller' });
            setCurrentView(View.HOME);
          }} 
        />;
      case View.ADMIN:
        return <AdminDashboard 
          config={config} 
          setConfig={setConfig} 
          appConfig={appConfig} 
          setAppConfig={setAppConfig}
          submissions={submissions}
          setSubmissions={setSubmissions}
          members={members}
          setMembers={setMembers}
          onNavigate={setCurrentView}
        />;
      case View.MEMBER_DASHBOARD:
        return currentUser ? <MemberDashboard user={currentUser} onNavigate={setCurrentView} language={language} /> : <HomeNew onStart={startTrading} onNavigate={setCurrentView} config={appConfig} language={language} />;
      case View.DATABASE_TEST:
        return <DatabaseTest onBack={() => setCurrentView(View.ADMIN)} />;
      case View.NEWS:
        return <News onBack={() => setCurrentView(View.HOME)} />;
      case View.DISCLAIMER:
        return <Disclaimer onBack={() => setCurrentView(View.HOME)} />;
      case View.FRAUD_REPORT:
        return <FraudReport onBack={() => setCurrentView(View.HOME)} />;
      default:
        return <HomeNew onStart={startTrading} onNavigate={setCurrentView} config={appConfig} language={language} />;
    }
  };

  const showLegalGate = isLegalAgreed === false;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-jd-dark text-jd-text">
      {showLegalGate && <LegalGate onAgree={handleLegalAgree} />}
      
      <Navbar 
        currentUser={currentUser} 
        onNavigate={(view) => setCurrentView(view)} 
        onLogout={handleLogout}
        isScrolled={isScrolled}
        config={appConfig}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-jd-dark border-t border-gray-900 pt-24 pb-16">
        <div className="max-w-[1600px] mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
          {/* Column 1: Identity */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-white font-black text-4xl tracking-tighter uppercase leading-none">
                JD MORGAN <br />
                <span className="text-jd-gold font-light not-italic">GLOBAL TRADING</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-xs">
                {t.sitemap_reg}
              </p>
            </div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">
              COPYRIGHT © 2026 LTD. <br /> ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-6">
            <h4 className="text-jd-gold text-[10px] font-black uppercase tracking-[0.5em]">{t.sitemap_platform}</h4>
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-[0.2em]">
              <button onClick={() => setCurrentView(View.HOME)} className="text-gray-500 hover:text-white transition-all text-left">{t.sitemap_home}</button>
              <button onClick={startTrading} className="text-gray-500 hover:text-white transition-all text-left">{t.sitemap_intel}</button>
              <button onClick={() => setCurrentView(View.NEWS)} className="text-gray-500 hover:text-white transition-all text-left">{t.nav_market}</button>
            </div>
          </div>

          {/* Column 3: Ecosystem */}
          <div className="space-y-6">
            <h4 className="text-jd-gold text-[10px] font-black uppercase tracking-[0.5em]">{t.sitemap_resources}</h4>
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-[0.2em]">
              <button onClick={() => setCurrentView(View.NEWS)} className="text-gray-500 hover:text-white transition-all text-left">{t.sitemap_news}</button>
              <a href="https://jdmorgan.ca" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-all text-left flex items-center gap-2">
                {t.nav_asia} <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
              </a>
            </div>
          </div>

          {/* Column 4: Legal & Fraud */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h4 className="text-jd-gold text-[10px] font-black uppercase tracking-[0.5em]">{t.sitemap_legal}</h4>
              <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-[0.3em]">
                <button onClick={() => setCurrentView(View.DISCLAIMER)} className="text-gray-500 hover:text-white transition-all text-left">{t.footer_privacy}</button>
                <button onClick={() => setCurrentView(View.DISCLAIMER)} className="text-gray-500 hover:text-white transition-all text-left">{t.footer_terms}</button>
                <button onClick={() => setCurrentView(View.DISCLAIMER)} className="text-gray-500 hover:text-white transition-all text-left">{t.footer_legal}</button>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView(View.FRAUD_REPORT)} 
              className="w-full py-4 border border-jd-gold/30 rounded-2xl text-[10px] font-black text-jd-gold uppercase tracking-[0.3em] hover:bg-jd-gold hover:text-jd-dark transition-all shadow-xl shadow-jd-gold/5"
            >
              {t.footer_fraud}
            </button>
          </div>
        </div>
      </footer>

      <EntryModal 
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSelectGuest={handleSelectGuest}
        onSelectMember={handleSelectMember}
        language={language}
      />
    </div>
  );
};

export default App;