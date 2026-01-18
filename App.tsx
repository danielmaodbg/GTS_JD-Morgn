import React, { useState, useEffect } from 'react';
import { View, User, TradeConfig, AppConfig, TradeSubmission } from './types';
import { INITIAL_CONFIG, INITIAL_APP_CONFIG, INITIAL_SUBMISSIONS, MOCK_USERS } from './constants';
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
import { dataService } from './dataService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [config, setConfig] = useState<TradeConfig>(INITIAL_CONFIG);
  const [appConfig, setAppConfig] = useState<AppConfig>(INITIAL_APP_CONFIG);
  const [submissions, setSubmissions] = useState<TradeSubmission[]>(INITIAL_SUBMISSIONS);
  const [members, setMembers] = useState<User[]>(MOCK_USERS);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isLegalAgreed, setIsLegalAgreed] = useState<boolean | null>(null);

  const ADMIN_EMAIL = "info@jdmorgan.ca";

  useEffect(() => {
    // Check legal agreement status
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
      user.username?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
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
      console.warn("Guest session initialization failed, but proceeding...");
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
        return <HomeNew onStart={startTrading} onNavigate={setCurrentView} config={appConfig} />;
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
        return currentUser ? <MemberDashboard user={currentUser} onNavigate={setCurrentView} /> : <HomeNew onStart={startTrading} onNavigate={setCurrentView} config={appConfig} />;
      case View.DATABASE_TEST:
        return <DatabaseTest onBack={() => setCurrentView(View.ADMIN)} />;
      case View.NEWS:
        return <News onBack={() => setCurrentView(View.HOME)} />;
      case View.DISCLAIMER:
        return <Disclaimer onBack={() => setCurrentView(View.HOME)} />;
      default:
        return <HomeNew onStart={startTrading} onNavigate={setCurrentView} config={appConfig} />;
    }
  };

  // Do not show LegalGate if it's currently null (checking state) or already agreed
  const showLegalGate = isLegalAgreed === false;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-jd-dark text-jd-text">
      {showLegalGate && <LegalGate onAgree={handleLegalAgree} />}
      
      <Navbar 
        currentUser={currentUser} 
        onNavigate={(view) => {
          setCurrentView(view);
        }} 
        onLogout={handleLogout}
        isScrolled={isScrolled}
        config={appConfig}
      />

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-jd-dark border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="text-left space-y-3">
            <h3 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">
              JD MORGAN <span className="text-jd-gold font-light">GLOBAL TRADING</span>
            </h3>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
              Copyright © 2026 JD MORGAN GLOBAL TRADING LTD. <br className="md:hidden" /> All Rights Reserved.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <button 
              onClick={() => { setCurrentView(View.DISCLAIMER); setTimeout(() => document.getElementById('privacy')?.scrollIntoView({behavior: 'smooth'}), 100); }} 
              className="hover:text-jd-gold transition-colors text-left"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => { setCurrentView(View.DISCLAIMER); setTimeout(() => document.getElementById('tos')?.scrollIntoView({behavior: 'smooth'}), 100); }} 
              className="hover:text-jd-gold transition-colors text-left"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => { setCurrentView(View.DISCLAIMER); setTimeout(() => document.getElementById('disclaimer')?.scrollIntoView({behavior: 'smooth'}), 100); }} 
              className="hover:text-jd-gold transition-colors text-left"
            >
              LEGAL DISCLAIMER
            </button>
            <button 
              onClick={() => setCurrentView(View.HOME_LEGACY)}
              className="text-[8px] opacity-20 hover:opacity-100 transition-opacity text-left"
            >
              LEGACY UI
            </button>
          </div>
        </div>
      </footer>

      <EntryModal 
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSelectGuest={handleSelectGuest}
        onSelectMember={handleSelectMember}
      />
    </div>
  );
};

export default App;