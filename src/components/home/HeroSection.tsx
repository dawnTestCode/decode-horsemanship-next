'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

export default function HeroSection() {
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
        <h1 className="text-3xl md:text-4xl font-bold text-stone-100 mb-6">
          Cracking the code to better horsemanship.
        </h1>
        <p className="text-lg text-stone-400 mb-12 max-w-2xl mx-auto">
          Private lessons for adults — whether you&apos;ve never touched a horse, used to ride as a kid,
          or think about it more than you say out loud. No experience required. Not a one-day event —
          ongoing instruction, built around wherever you actually are.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/lessons/book"
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-900/30"
          >
            Book a Lesson
          </Link>
          <Link
            href="/lessons/book"
            className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-all"
          >
            Book a Free Farm Tour
          </Link>
        </div>
      </div>

      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-stone-500" size={32} />
      </div>
    </section>
  );
}
