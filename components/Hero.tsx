import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';

interface HeroProps {
  onStart: () => void;
  config: AppConfig;
}

const Hero: React.FC<HeroProps> = ({ onStart, config }) => {
  const [index, setIndex] = useState(0);
  const slides = [...config.heroSlides].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-jd-dark">
      {/* Background Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[3000ms] ease-out ${
            i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.img}')` }}
          />
          
          {/* 融合漸層：頂部透明，確保與 Navbar 無縫對接 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jd-dark/20 to-jd-dark"></div>
          
          {/* 微光濾鏡 */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* 氛圍遮罩 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,25,47,0.4)_100%)]"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="max-w-7xl space-y-16 mt-20">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h2 className="text-jd-gold text-sm md:text-base font-black tracking-[0.8em] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
              {slides[index]?.subtitle}
            </h2>
            <h1 className="text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]">
              {slides[index]?.title}
            </h1>
          </div>
          
          <div className="pt-10 flex flex-wrap justify-center gap-10 animate-in fade-in zoom-in duration-1000 delay-500">
            <button 
              onClick={onStart}
              className="group relative bg-jd-gold text-jd-dark font-black w-72 h-20 rounded-xl shadow-[0_20px_60px_rgba(251,191,36,0.3)] transition-all duration-500 hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <span className="relative z-10 tracking-[0.05em] text-4xl uppercase leading-none mt-1">進入交易大廳</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-2xl font-black w-72 h-20 rounded-xl transition-all duration-500 tracking-[0.05em] text-4xl uppercase shadow-2xl flex items-center justify-center">
              <span className="leading-none mt-1">關於我們</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-16 w-full flex justify-center items-center space-x-8 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className="group py-4 px-2">
              <div className={`h-[2px] transition-all duration-700 rounded-full ${
                i === index ? 'w-20 bg-jd-gold shadow-[0_0_20px_rgba(251,191,36,1)]' : 'w-10 bg-white/20'
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;