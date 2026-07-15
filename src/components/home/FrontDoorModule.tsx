import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function OtherWaysToStart() {
  return (
    <section className="py-16 px-4 bg-black border-b border-stone-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-[#f5f0e8] mb-6">
          Not sure lessons are the first step?
        </h2>
        <p className="text-lg text-stone-400 mb-8">
          Start smaller. Single-day experiences — No Reins, Groundwork, Dust & Leather — are low-commitment ways to find out if this is for you before you book ongoing lessons.
        </p>
        <Link
          href="/experiences"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 border border-stone-700 hover:border-red-500 text-stone-200 font-medium rounded-lg transition-colors"
        >
          Experiences
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
