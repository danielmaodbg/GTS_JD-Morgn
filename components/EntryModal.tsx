import React from 'react';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGuest: () => void;
  onSelectMember: () => void;
}

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, onSelectGuest, onSelectMember }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-jd-dark/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-jd-light border border-jd-gold/30 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-jd-gold to-transparent"></div>
        
        <div className="p-14 text-center">
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-3xl"></i>
          </button>

          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter leading-[1.1]">
            WELCOME TO <br /> JD MORGAN
          </h2>
          <p className="text-jd-gold text-sm font-black uppercase tracking-[0.5em] mb-14">Security Access Protocol</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* Non-Member Button */}
            <button 
              onClick={onSelectGuest}
              className="group relative flex flex-col items-center justify-center p-14 bg-jd-dark border border-white/5 hover:border-blue-500/50 rounded-3xl transition-all hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]"
            >
              <div className="w-24 h-24 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-blue-500/20">
                <i className="fa-solid fa-user-secret text-4xl text-blue-400"></i>
              </div>
              <span className="text-white font-black text-2xl mb-2 tracking-wider">非會員進入</span>
              <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Quick Access</span>
            </button>

            {/* Member Button */}
            <button 
              onClick={onSelectMember}
              className="group relative flex flex-col items-center justify-center p-14 bg-jd-dark border border-white/5 hover:border-jd-gold/50 rounded-3xl transition-all hover:shadow-[0_0_50px_rgba(251,191,36,0.2)]"
            >
              <div className="w-24 h-24 rounded-2xl bg-jd-gold/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-jd-gold/20">
                <i className="fa-solid fa-id-card text-4xl text-jd-gold"></i>
              </div>
              <span className="text-white font-black text-2xl mb-2 tracking-wider">會員驗證</span>
              <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Priority Entry</span>
            </button>
          </div>

          <p className="mt-14 text-xs text-gray-600 font-bold uppercase tracking-[0.2em]">
            <i className="fa-solid fa-shield-halved mr-3 text-jd-gold text-sm"></i> AES-256 Banking Grade Encryption Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;