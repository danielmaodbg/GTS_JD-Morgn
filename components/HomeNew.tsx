import React, { useState, useEffect } from 'react';
import { AppConfig, View, Language } from '../types';
import { translations } from '../translations';

interface HomeNewProps {
  onStart: () => void;
  onNavigate: (view: View) => void;
  config: AppConfig;
  language: Language;
}

const HomeNew: React.FC<HomeNewProps> = ({ onStart, onNavigate, config, language }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const t = translations[language];
  
  const slides = Array.isArray(config?.heroSlides) && config.heroSlides.length > 0 
    ? [...config.heroSlides].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [{
        id: 'default-slide',
        img: 'https://images.unsplash.com/photo-1518186239751-2467ef7f1979?q=80&w=2070&auto=format&fit=crop',
        title: 'JD MORGAN\nGLOBAL TRADING',
        titleEn: 'JD MORGAN\nGLOBAL TRADING',
        subtitle: '安全全球終端',
        subtitleEn: 'SECURE GLOBAL TERMINAL',
        order: 0
      }];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    let interval: number | undefined;
    if (slides.length > 1) {
      interval = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [slides.length]);

  const currentSlide = slides[index] || slides[0];

  const renderTitle = (title: string) => {
    return title.split('\n').map((line, i) => (
      <span key={i} className="block">{line}</span>
    ));
  };

  const displayTitle = (language === Language.EN && currentSlide.titleEn) ? currentSlide.titleEn : currentSlide.title;
  const displaySubtitle = (language === Language.EN && currentSlide.subtitleEn) ? currentSlide.subtitleEn : currentSlide.subtitle;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-jd-dark">
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id || i}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${
              i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <img 
              src={slide.img} 
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';
              }}
            />
            {/* 強化頂部融合漸層，確保 Navbar 融合感 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-jd-dark/95"></div>
            <div className="absolute inset-0 bg-black/5"></div>
          </div>
        ))}
      </div>

      <div className={`relative z-10 flex flex-col items-center justify-center h-full text-center px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-7xl space-y-8 md:space-y-10 mt-16">
          
          <div className="space-y-6">
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
              <p className="text-jd-gold text-[11px] md:text-sm font-black tracking-[0.8em] uppercase drop-shadow-lg">
                {displaySubtitle?.toUpperCase()}
              </p>
              
              <div className="relative inline-block mt-4">
                <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-black text-white leading-[1.3] tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] select-none uppercase transition-all duration-1000">
                  {renderTitle(displayTitle)}
                </h1>
                <div className="w-20 h-1 bg-jd-gold mx-auto rounded-full shadow-[0_0_15px_rgba(251,191,36,1)] mt-8"></div>
              </div>
            </div>
          </div>

          <div className="pt-12 flex flex-col sm:flex-row justify-center gap-8 animate-in fade-in zoom-in duration-1000 delay-300">
            <button 
              onClick={onStart}
              className="group relative bg-jd-gold hover:bg-yellow-400 text-jd-dark font-black px-12 py-5 rounded-2xl shadow-[0_15px_40px_rgba(251,191,36,0.3)] transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10 tracking-[0.1em] text-lg md:text-xl font-black uppercase leading-none inline-block">{t.home_btn_provide}</span>
            </button>
            
            {/* 按鈕改為高對比純白邊框 */}
            <button 
              onClick={() => onNavigate(View.NEWS)}
              className="bg-transparent hover:bg-white/10 text-white border border-white/40 backdrop-blur-xl font-black px-12 py-5 rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 text-lg md:text-xl tracking-[0.1em] uppercase leading-none inline-flex items-center justify-center shadow-2xl"
            >
              {t.home_btn_observe}
            </button>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-16 w-full flex justify-center space-x-4 z-20">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)}
              className="group py-4 px-2"
            >
              <div className={`h-1.5 transition-all duration-1000 rounded-full ${
                i === index ? 'w-20 bg-jd-gold shadow-[0_0_15px_rgba(251,191,36,1)]' : 'w-10 bg-white/20 hover:bg-white/40'
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeNew;