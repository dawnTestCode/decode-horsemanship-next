import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPublishedExperiences } from '@/config/experiences';
import ExperienceGrid from './ExperienceGrid';

export default function WorkshopsSection() {
  const cards = getPublishedExperiences({ page: 'home' });

  return (
    <section id="workshops" className="py-20 px-4 bg-black border-b border-stone-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">Workshops and experiences</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-4">
            Come for a day. Leave with something real.
          </h2>
          <p className="text-lg text-stone-400">
            These are not riding lessons dressed up as retreats. They are small, hands-on experiences built
            around honest attention, useful work, and what a horse notices before people say a word.
          </p>
        </div>

        <ExperienceGrid cards={cards} />

        <div className="text-center mt-10">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            See all workshops and upcoming dates
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
