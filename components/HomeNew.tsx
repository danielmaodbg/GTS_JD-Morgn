import React, { useState, useEffect } from 'react';
import { AppConfig, View } from '../types';

interface HomeNewProps {
  onStart: () => void;
  onNavigate: (view: View) => void;
  config: AppConfig;
}

const HomeNew: React.FC<HomeNewProps> = ({ onStart, onNavigate, config }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const slides = Array.isArray(config?.heroSlides) && config.heroSlides.length > 0 
    ? [...config.heroSlides].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [{
        id: 'default-slide',
        img: 'https://images.unsplash.com/photo-1518186239751-2467ef7f1979?q=80&w=2070&auto=format&fit=crop',
        title: 'JD MORGAN',
        subtitle: 'GLOBAL TRADING TERMINAL',
        order: 0
      }];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    let interval: number | undefined;
    if (slides.length > 1) {
      interval = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 8000);
    }
    
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [slides.length]);

  const currentSlide = slides[index] || slides[0];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-jd-dark">
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id || i}
            className={`absolute inset-0 transition-all duration-[1000ms] ease-out ${
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
            {/* 深度融合遮罩：頂部完全透明以容納 Navbar Logo，底部深色強化內容可讀性 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jd-dark/5 to-jd-dark/90"></div>
            <div className="absolute inset-0 bg-black/5"></div>
            
            {/* 四周氛圍陰影 */}
            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.6)]"></div>
          </div>
        ))}
      </div>

      <div className={`relative z-10 flex flex-col items-center justify-center h-full text-center px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-7xl space-y-6 md:space-y-8">
          <div className="space-y-3">
            <p className="text-jd-gold text-[10px] md:text-xs font-black tracking-[0.8em] uppercase drop-shadow-lg">
              {currentSlide?.subtitle || "SECURE GLOBAL TERMINAL"}
            </p>
            
            <h1 className="text-3xl md:text-6xl lg:text-[7rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)] select-none uppercase italic">
              {currentSlide?.title || "JD MORGAN"}
            </h1>
            
            <div className="w-16 h-1 bg-jd-gold mx-auto rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)]"></div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={onStart}
              className="group relative bg-jd-gold hover:bg-yellow-400 text-jd-dark font-black px-7 py-4 rounded-xl shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10 tracking-[0.05em] text-xl md:text-2xl uppercase leading-none mt-1 inline-block">開啟交易終端</span>
            </button>
            
            <button 
              onClick={() => onNavigate(View.NEWS)}
              className="bg-transparent hover:bg-white/5 text-white border border-white/20 backdrop-blur-md font-black px-7 py-4 rounded-xl transition-all duration-500 hover:scale-105 active:scale-95 text-xl md:text-2xl tracking-[0.05em] uppercase leading-none mt-1 inline-flex items-center justify-center shadow-xl"
            >
              最新消息
            </button>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-12 w-full flex justify-center space-x-4 z-20">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-700 rounded-full ${
                i === index ? 'w-16 bg-jd-gold shadow-[0_0_10px_rgba(251,191,36,1)]' : 'w-8 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeNew;