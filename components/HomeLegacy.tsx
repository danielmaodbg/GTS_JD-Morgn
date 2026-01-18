import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';

interface HomeLegacyProps {
  onStart: () => void;
  config: AppConfig;
}

const HomeLegacy: React.FC<HomeLegacyProps> = ({ onStart, config }) => {
  const [index, setIndex] = useState(0);
  const slides = [...config.heroSlides].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000); // 輪播秒數減半
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-jd-dark">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out ${
            i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.img}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jd-dark/30 to-jd-dark"></div>
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <div className="max-w-7xl space-y-12">
          <h2 className="text-jd-gold text-xs font-black tracking-[1em] uppercase">
            {slides[index]?.subtitle}
          </h2>
          <h1 className="text-6xl md:text-[8rem] font-black text-white leading-none tracking-tighter">
            {slides[index]?.title}
          </h1>
          <div className="pt-12 flex justify-center gap-8">
            <button onClick={onStart} className="bg-jd-gold text-jd-dark font-black px-12 py-5 rounded-lg text-sm uppercase tracking-widest">
              進入交易終端
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLegacy;