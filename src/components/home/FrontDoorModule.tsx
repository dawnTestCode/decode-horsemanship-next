import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FrontDoorModule() {
  return (
    <section className="py-16 px-4 bg-black border-b border-stone-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-[#f5f0e8] mb-6">
          Not ready to adopt?
        </h2>
        <p className="text-lg text-stone-400 mb-8">
          There&apos;s a whole world here before that.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/experiences"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 border border-stone-700 hover:border-red-500 text-stone-200 font-medium rounded-lg transition-colors"
          >
            Experiences
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/lessons"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 border border-stone-700 hover:border-red-500 text-stone-200 font-medium rounded-lg transition-colors"
          >
            Lessons
            <ArrowRight size={18} />
          </Link>
        </div>
        <p className="text-sm text-stone-500 mt-6">
          Single-day ways to find out if this is for you, or ongoing instruction whether you&apos;re new to horses or new to owning one.
        </p>
      </div>
    </section>
  );
}
