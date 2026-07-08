'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LessonsPage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f5f0e8] leading-tight mb-8">
            Not all horse girls start as little girls.
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-3xl">
            Some people have wanted this their whole life and never said it out loud. Some just brought a horse home last month and have no idea what they&apos;re doing. Both of you are in the right place.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">

        {/* What It Is */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">WHAT IT IS</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Private, one-on-one lessons in natural horsemanship. Not a one-day event. Not a retreat. Ongoing instruction, roughly an hour at a time, built around wherever you actually are.
          </p>
        </section>

        {/* Two Ways In */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-8">TWO WAYS IN</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Door 1 - Already have a horse */}
            <Link
              href="/lessons/decode-the-noise"
              className="group block p-8 bg-stone-900/50 rounded-xl border border-stone-800 hover:border-red-900/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-[#f5f0e8] mb-4">Already have a horse?</h3>
              <p className="text-stone-400 mb-6">
                Between the internet, the barn aisle, and three conflicting trainers, you don&apos;t need one more opinion. You need someone to decode the noise.
              </p>
              <span className="inline-flex items-center gap-2 text-red-500 font-medium group-hover:gap-3 transition-all">
                Decode the Noise
                <ArrowRight size={18} />
              </span>
            </Link>

            {/* Door 2 - Never had one */}
            <Link
              href="/lessons/new-to-horses"
              className="group block p-8 bg-stone-900/50 rounded-xl border border-stone-800 hover:border-red-900/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-[#f5f0e8] mb-4">Never had one, but you think about it more than you say out loud?</h3>
              <p className="text-stone-400 mb-6">
                You don&apos;t have to already own a horse to start.
              </p>
              <span className="inline-flex items-center gap-2 text-red-500 font-medium group-hover:gap-3 transition-all">
                Start Here
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </section>

        {/* Who Runs It */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">WHO RUNS IT</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Dawn — founder of Decode Horsemanship. She&apos;s worked with horses every day for years, and with people for longer than that. She&apos;s not selling a method. She&apos;s telling you what&apos;s true for your horse, or the horse you haven&apos;t met yet.
          </p>
        </section>

        {/* The Practical Part */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-8">THE PRACTICAL PART</h2>
          <div className="space-y-4 max-w-2xl">
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Length</span>
              <span className="text-stone-400">About an hour per lesson.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Format</span>
              <span className="text-stone-400">Private. One person or household at a time.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Frequency</span>
              <span className="text-stone-400">Weekly, biweekly, or one-off. Your call.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Cost</span>
              <span className="text-stone-400">$125 per lesson. Packages available (see each door for details).</span>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/lessons/book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              Book a Lesson
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Other Ways to Start */}
        <section className="py-16">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">OTHER WAYS TO START</h2>
          <p className="text-lg text-stone-300 mb-4">
            Not ready for lessons yet? <Link href="/no-reins" className="text-red-500 hover:text-red-400 transition-colors">No Reins</Link> and <Link href="/groundwork" className="text-red-500 hover:text-red-400 transition-colors">Groundwork</Link> are single-day ways to find out if this is for you.
          </p>
          <p className="text-lg text-stone-300">
            Already sure? <Link href="/" className="text-red-500 hover:text-red-400 transition-colors">Meet our horses</Link> — some of them are ready to come home.
          </p>
        </section>

      </div>
    </div>
  );
}
