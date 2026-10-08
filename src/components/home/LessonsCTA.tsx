import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LessonsCTA() {
  return (
    <section id="lessons" className="py-16 px-4 bg-stone-900/30 border-b border-stone-800 scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-100 mb-4">Want to keep going with horses?</h2>
        <p className="text-lg text-stone-400 mb-8">
          Workshops are one way in. Private lessons are the next step for people who want an ongoing
          relationship with horses—or who already own one and are tired of guessing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/lessons"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 border border-stone-700 hover:border-red-500 text-stone-200 font-medium rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Explore private lessons
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/kids-lessons"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            Kids &amp; family lessons
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
