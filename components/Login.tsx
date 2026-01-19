import React, { useState } from 'react';
import { COUNTRIES } from '../constants';
import { User } from '../types';
import { dataService } from '../dataService';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegisterSuccess: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegisterSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '', 
    password: '',
    email: '',    
    phone: '',
    country: 'Singapore',
    social: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); 
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (isRegister) {
      try {
        const userData = {
          name: formData.username,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          socialMedia: formData.social,
          username: formData.email,
          role: 'client'
        };
        await dataService.registerAndVerify(userData, formData.password);
        setIsLoading(false);
        onRegisterSuccess(formData.email);
      } catch (err: any) {
        setIsLoading(false);
        if (err.code === 'auth/email-already-in-use') {
          setErrorMsg("⚠️ 帳戶已存在：此郵箱已在驗證系統中。");
        } else {
          setErrorMsg(`註冊失敗: ${err.message || '請確認資訊填寫正確'}`);
        }
      }
    } else {
      try {
        const user = await dataService.signIn(formData.username, formData.password);
        setIsLoading(false);
        onLogin(user);
      } catch (err: any) {
        setIsLoading(false);
        if (err.message === "EMAIL_NOT_VERIFIED") {
          setErrorMsg("⚠️ 帳戶尚未激活：請先檢查您的電子郵件並點擊驗證連結。");
        } else {
          setErrorMsg("登入失敗：帳號或密碼錯誤。");
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-12 overflow-hidden">
      {/* Background with Hero Image Style */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url('https://40072.jdmorgan.ca/pictures/hero-gold.jpg')`,
          filter: 'brightness(0.2) blur(4px)'
        }}
      />
      
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-jd-dark/40 via-jd-dark/80 to-jd-dark"></div>

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-lg bg-jd-light/90 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jd-gold via-transparent to-jd-gold opacity-50"></div>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">
            JD MORGAN <span className="text-jd-gold font-light not-italic ml-1">{isRegister ? 'REGISTER' : 'LOGIN'}</span>
          </h2>
          <p className="text-gray-500 text-[10px] mt-2 font-black tracking-[0.4em] uppercase">Identity Verification Required</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-bold animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-jd-gold uppercase tracking-[0.2em] mb-2">
                {isRegister ? 'Email (Primary Verification)' : 'Email Address'}
              </label>
              <input 
                name={isRegister ? "email" : "username"} 
                type="email" 
                value={isRegister ? formData.email : formData.username} 
                onChange={handleChange} 
                className="w-full bg-jd-dark/60 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none transition-colors" 
                required 
                placeholder="example@jdmorgan.ca"
              />
            </div>

            {isRegister && (
              <div className="col-span-full">
                <label className="block text-[10px] font-black text-jd-gold uppercase tracking-[0.2em] mb-2">Full Name</label>
                <input 
                  name="username" 
                  type="text" 
                  value={formData.username} 
                  onChange={handleChange} 
                  className="w-full bg-jd-dark/60 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none transition-colors" 
                  required 
                  placeholder="Enter your legal name"
                />
              </div>
            )}

            <div className={isRegister ? 'col-span-1' : 'col-span-full'}>
              <label className="block text-[10px] font-black text-jd-gold uppercase tracking-[0.2em] mb-2">Password</label>
              <input 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full bg-jd-dark/60 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none transition-colors" 
                required 
                placeholder="••••••••"
              />
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-jd-gold uppercase tracking-[0.2em] mb-2">Country</label>
                  <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-jd-dark/60 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none cursor-pointer">
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-jd-gold uppercase tracking-[0.2em] mb-2">Mobile Phone</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    inputMode="numeric"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full bg-jd-dark/60 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" 
                    required 
                    placeholder="Numeric only" 
                  />
                </div>
                <div className="col-span-full">
                  <label className="block text-[10px] font-black text-jd-gold uppercase tracking-[0.2em] mb-2">Social Account (WeChat / TG)</label>
                  <input name="social" type="text" value={formData.social} onChange={handleChange} className="w-full bg-jd-dark/60 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-jd-gold outline-none" placeholder="ID for rapid contact" />
                </div>
              </>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-jd-gold hover:bg-yellow-400 text-jd-dark font-black py-6 rounded-2xl transition-all shadow-xl mt-4 uppercase tracking-[0.2em] text-2xl leading-none flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isLoading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
            {isRegister ? '發送驗證郵件' : '安全登入系統'}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <button 
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(null); }} 
            className="text-jd-gold hover:text-white text-base font-black uppercase tracking-widest underline underline-offset-8 transition-colors"
          >
            {isRegister ? '已有帳號？返回登入' : "還不是會員？立即申請"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;