import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ExperienceCard } from '@/config/experiences';

interface ExperienceGridProps {
  cards: ExperienceCard[];
}

export default function ExperienceGrid({ cards }: ExperienceGridProps) {
  return (
    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <li
          key={card.slug}
          className={`group relative flex flex-col p-8 rounded-xl border transition-colors focus-within:border-red-500 ${
            card.featured
              ? 'bg-gradient-to-br from-red-950/30 to-stone-900/50 border-red-900/50 hover:border-red-600'
              : 'bg-stone-900/50 border-stone-800 hover:border-red-700'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500 mb-2">{card.audience}</p>
          <h3 className="text-2xl font-bold text-stone-100 mb-3">{card.title}</h3>
          <p className="text-stone-400 mb-4 flex-1">{card.description}</p>
          {card.details && card.details.length > 0 && (
            <p className="text-sm text-stone-300 mb-6">{card.details.join(' · ')}</p>
          )}
          {card.href && card.ctaLabel && (
            <Link
              href={card.href}
              className="inline-flex items-center gap-2 text-red-500 group-hover:text-red-400 font-medium after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
            >
              {card.ctaLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
