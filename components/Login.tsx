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
          username: formData.email, // 確保數據一致性：username 預設為 email
          role: 'client'
        };
        await dataService.registerAndVerify(userData, formData.password);
        setIsLoading(false);
        onRegisterSuccess(formData.email);
      } catch (err: any) {
        setIsLoading(false);
        if (err.code === 'auth/email-already-in-use') {
          // 依據用戶最新需求：僅顯示特定警示文字
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
          setErrorMsg("登入失敗：帳號或密碼錯誤，或該帳戶尚未授權。");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
      <div className="w-full max-w-lg bg-jd-light/60 backdrop-blur-xl border border-jd-gold/10 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jd-gold via-transparent to-jd-gold"></div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
            JD MORGAN <span className="text-jd-gold font-light not-italic ml-1">{isRegister ? 'REGISTER' : 'LOGIN'}</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium tracking-widest uppercase">Identity Verification Required</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="col-span-full">
              <label className="block text-[10px] font-bold text-jd-gold uppercase tracking-widest mb-1.5">
                {isRegister ? 'Email (Primary Verification)' : 'Email Address'}
              </label>
              <input 
                name={isRegister ? "email" : "username"} 
                type="email" 
                value={isRegister ? formData.email : formData.username} 
                onChange={handleChange} 
                className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-jd-gold outline-none" 
                required 
                placeholder="example@jdmorgan.ca"
              />
            </div>

            {isRegister && (
              <div className="col-span-full">
                <label className="block text-[10px] font-bold text-jd-gold uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  name="username" 
                  type="text" 
                  value={formData.username} 
                  onChange={handleChange} 
                  className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-jd-gold outline-none" 
                  required 
                  placeholder="Enter your legal name"
                />
              </div>
            )}

            <div className={isRegister ? 'col-span-1' : 'col-span-full'}>
              <label className="block text-[10px] font-bold text-jd-gold uppercase tracking-widest mb-1.5">Password</label>
              <input 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-jd-gold outline-none" 
                required 
                placeholder="••••••••"
              />
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-jd-gold uppercase tracking-widest mb-1.5">Country</label>
                  <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-jd-gold outline-none">
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-jd-gold uppercase tracking-widest mb-1.5">Mobile Phone</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    inputMode="numeric"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-jd-gold outline-none" 
                    required 
                    placeholder="Numeric digits only" 
                  />
                </div>
                <div className="col-span-full">
                  <label className="block text-[10px] font-bold text-jd-gold uppercase tracking-widest mb-1.5">Social Account (WeChat / Telegram)</label>
                  <input name="social" type="text" value={formData.social} onChange={handleChange} className="w-full bg-jd-dark border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-jd-gold outline-none" placeholder="ID for rapid contact" />
                </div>
              </>
            )}
          </div>
          
          <button type="submit" disabled={isLoading} className="w-full bg-jd-gold hover:bg-yellow-500 text-jd-dark font-black py-5 rounded-xl transition-all shadow-xl mt-4 uppercase tracking-widest text-2xl leading-none flex items-center justify-center gap-3">
            {isLoading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
            {isRegister ? '發送驗證郵件' : '安全登入系統'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-8">
          <button onClick={() => { setIsRegister(!isRegister); setErrorMsg(null); }} className="text-jd-gold hover:text-white text-base font-bold uppercase tracking-widest underline transition-colors">
            {isRegister ? '已有帳號？返回登入' : "還不是會員？立即申請"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;