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

      {/* Symmetric Modern Sitemap Footer - Enhanced Font Sizes and Layout */}
      <footer className="bg-jd-dark border-t border-white/5 pt-32 pb-16">
        <div className="max-w-[1600px] mx-auto px-12 md:px-20">
          <div className="flex flex-col items-center text-center md:grid md:grid-cols-2 lg:grid-cols-4 md:items-start md:text-left gap-20 md:gap-16 mb-24">
            
            {/* Column 1: Identity & Social */}
            <div className="flex flex-col items-center md:items-start space-y-12">
              <div className="flex flex-col items-center md:items-start space-y-8">
                <h3 className="text-white font-black text-6xl tracking-tighter uppercase leading-none">
                  JD MORGAN
                </h3>
                <div className="inline-block px-8 py-3.5 border border-jd-gold/30 rounded-sm">
                  <span className="text-jd-gold font-black text-3xl tracking-[0.3em] uppercase leading-none">
                    GLOBAL TRADING
                  </span>
                </div>
                <div className="pt-4">
                  <p className="text-lg text-gray-500 font-black uppercase tracking-[0.3em] leading-relaxed">
                    {t.sitemap_reg}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-12 pt-6">
                 <a href="#" className="text-gray-600 hover:text-jd-gold transition-all text-4xl"><i className="fa-brands fa-linkedin-in"></i></a>
                 <a href="#" className="text-gray-600 hover:text-jd-gold transition-all text-4xl"><i className="fa-brands fa-telegram"></i></a>
              </div>
            </div>

            {/* Column 2: Trade Terminal */}
            <div className="flex flex-col items-center md:items-start space-y-12">
              <h4 className="text-jd-gold text-2xl font-black uppercase tracking-[0.5em]">
                 {t.sitemap_platform}
              </h4>
              <div className="flex flex-col items-center md:items-start gap-8 text-xl font-black uppercase tracking-[0.25em]">
                <button onClick={() => setCurrentView(View.HOME)} className="text-gray-500 hover:text-jd-gold transition-all">{t.sitemap_home}</button>
                <button onClick={startTrading} className="text-gray-500 hover:text-jd-gold transition-all">{t.sitemap_intel}</button>
                <button onClick={() => setCurrentView(View.NEWS)} className="text-gray-500 hover:text-jd-gold transition-all">{t.nav_market}</button>
                <button onClick={() => setCurrentView(View.NEWS)} className="text-gray-500 hover:text-jd-gold transition-all">{t.sitemap_news}</button>
              </div>
            </div>

            {/* Column 3: Global Network */}
            <div className="flex flex-col items-center md:items-start space-y-12">
              <h4 className="text-jd-gold text-2xl font-black uppercase tracking-[0.5em]">
                 {t.sitemap_network}
              </h4>
              <div className="flex flex-col items-center md:items-start gap-8 text-xl font-black uppercase tracking-[0.25em]">
                <a href="https://gts-jd-morgn.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-jd-gold transition-all">{t.nav_north_america}</a>
                <a href="https://jdmorgan.ca" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-jd-gold transition-all">{t.nav_asia_pacific}</a>
              </div>
            </div>

            {/* Column 4: Compliance & Security */}
            <div className="flex flex-col items-center md:items-start space-y-12">
              <h4 className="text-jd-gold text-2xl font-black uppercase tracking-[0.5em]">
                 {t.sitemap_legal}
              </h4>
              <div className="flex flex-col items-center md:items-start gap-8 text-xl font-black uppercase tracking-[0.25em]">
                <button onClick={() => setCurrentView(View.DISCLAIMER)} className="text-gray-500 hover:text-jd-gold transition-all">{t.footer_privacy}</button>
                <button onClick={() => setCurrentView(View.DISCLAIMER)} className="text-gray-500 hover:text-jd-gold transition-all">{t.footer_terms}</button>
                <button onClick={() => setCurrentView(View.DISCLAIMER)} className="text-gray-500 hover:text-jd-gold transition-all">{t.footer_legal}</button>
              </div>
            </div>
          </div>

          {/* Centered Fraud Report Button - Enormous font and clear positioning */}
          <div className="flex justify-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <button 
              onClick={() => setCurrentView(View.FRAUD_REPORT)} 
              className="w-full max-w-2xl py-8 border border-jd-gold/40 rounded-2xl text-xl font-black text-jd-gold uppercase tracking-[0.5em] hover:bg-jd-gold hover:text-jd-dark transition-all shadow-2xl flex items-center justify-center gap-6 group"
            >
              <i className="fa-solid fa-shield-halved group-hover:scale-110 transition-transform text-2xl"></i> {t.footer_fraud}
            </button>
          </div>

          {/* Bottom Copyright Bar - Significant Font Increase */}
          <div className="pt-16 border-t border-white/5 text-center">
            <p className="text-xl text-gray-700 font-black uppercase tracking-[0.6em]">
              COPYRIGHT © 2026 JD MORGAN GROUP. ALL RIGHTS RESERVED.
            </p>
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