import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Still image only; headline never depends on the image to be read */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${siteConfig.branding.heroBackground})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-28 pb-16">
        <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-20 md:h-28 mx-auto mb-8" />
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-red-500 mb-4">
          For women who hold everything together
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-stone-100 mb-6 leading-tight">
          Something just for you. That asks nothing of you.
        </h1>
        <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
          No performing. No producing. No taking care of anyone else for a few hours. A horse doesn&rsquo;t
          need you to be anything — she responds to what&rsquo;s real. Come tired. This is rest, honesty, and
          connection on your terms.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/no-reins"
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-red-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            See No Reins
          </Link>
          <Link
            href="/experiences"
            className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Explore all experiences
          </Link>
        </div>
        <p className="mt-6 text-sm text-stone-400">
          No horse experience needed. You don&rsquo;t have to share anything, or be &ldquo;ready.&rdquo;
        </p>
      </div>

      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-bounce" aria-hidden="true">
        <ChevronDown className="text-stone-500" size={32} />
      </div>
    </section>
  );
}
