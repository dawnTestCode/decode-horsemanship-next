'use client';

import { ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

interface HeroSectionProps {
  onSectionClick: (section: string) => void;
}

export default function HeroSection({ onSectionClick }: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${siteConfig.branding.heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-32 md:h-48 mx-auto mb-8" />
        <p className="text-xl md:text-2xl text-stone-300 italic mb-8">
          {siteConfig.branding.tagline}
        </p>
        <p className="text-lg text-stone-400 mb-12 max-w-2xl mx-auto">
          We rescue horses from the auction and slaughter pipeline, rehabilitate them with patience and expertise,
          and match them with loving forever homes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onSectionClick('horses')}
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-900/30"
          >
            View Available Horses
          </button>
          <button
            onClick={() => onSectionClick('mission')}
            className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-all"
          >
            Our Mission
          </button>
        </div>
      </div>

      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-stone-500" size={32} />
      </div>
    </section>
  );
}
