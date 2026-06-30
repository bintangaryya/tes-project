'use client';

import { useState, useEffect } from 'react';
import { getTips } from '@/lib/translations';
import { Language } from '@/lib/types';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  language: Language;
}

export default function TipsCarousel({ language }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const tips = getTips(language);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <Lightbulb size={18} className="text-amber-600" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Tips Keuangan</h4>
      </div>

      <div className="relative">
        <p className="text-gray-600 text-sm leading-relaxed min-h-[40px] px-8">
          {tips[currentIndex]}
        </p>
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all"
        >
          <ChevronLeft size={14} className="text-gray-500" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all"
        >
          <ChevronRight size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'bg-amber-500 w-4' : 'bg-amber-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
