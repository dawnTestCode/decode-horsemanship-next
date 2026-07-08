'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NewToHorsesPage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f5f0e8] leading-tight mb-8">
            You don&apos;t have to already own a horse to start.
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-3xl">
            You don&apos;t need to have grown up on one either.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">

        {/* Who It's For */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">WHO IT&apos;S FOR</h2>
          <ul className="space-y-4 text-lg text-stone-300 max-w-3xl">
            <li className="flex gap-3">
              <span className="text-red-500">—</span>
              <span>You never had a horse growing up. You still think about it more than you&apos;d admit.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500">—</span>
              <span>You&apos;ve stood at a fence and wondered what it would feel like, and never taken the next step.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500">—</span>
              <span>You&apos;re not sure you want to own a horse. You just want to know if the pull you feel is real.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500">—</span>
              <span>You don&apos;t want a performance, a test, or a class where everyone else already knows what they&apos;re doing.</span>
            </li>
          </ul>
        </section>

        {/* What It Is */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">WHAT IT IS</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Low-stakes, one-on-one time with a horse and someone who can answer your actual questions. Not a lesson in the school sense. Not a retreat. A real, unhurried look at what this is actually like.
          </p>
        </section>

        {/* What Happens */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">WHAT HAPPENS</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            You show up. No riding required, unless and until you want to work toward it. We start on the ground — haltering, leading, grooming, learning to read what a horse is actually telling you. You find out what this feels like, not what it looks like online.
          </p>
        </section>

        {/* The Practical Part */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-8">THE PRACTICAL PART</h2>
          <div className="space-y-4 max-w-2xl">
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Length</span>
              <span className="text-stone-400">About an hour.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Where</span>
              <span className="text-stone-400">At the Decode farm in Chapel Hill, with our own herd.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Frequency</span>
              <span className="text-stone-400">One-off to start. Ongoing if it turns into more.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Group size</span>
              <span className="text-stone-400">Private.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Cost</span>
              <span className="text-stone-400">$125 per lesson. 4-lesson package: $450. 8-lesson package: $850.</span>
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

        {/* Who Runs It */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">WHO RUNS IT</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Dawn, founder of Decode Horsemanship. She&apos;s worked with horses every day for years, and with people for longer than that. She&apos;s not selling a method. She&apos;s telling you what&apos;s true for your horse, or the horse you haven&apos;t met yet.
          </p>
        </section>

        {/* Questions */}
        <section className="py-16">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-8">QUESTIONS</h2>
          <div className="space-y-8 max-w-3xl">
            <div>
              <h3 className="font-semibold text-[#f5f0e8] mb-2">Do I have to know I want a horse before I book this?</h3>
              <p className="text-stone-400">
                No. Most people who book this don&apos;t know yet. That&apos;s the point.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#f5f0e8] mb-2">What if I try it and decide it&apos;s not for me?</h3>
              <p className="text-stone-400">
                Then you&apos;ll know, and you&apos;ll know for real reasons instead of guesses. That&apos;s a good outcome too.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#f5f0e8] mb-2">Is this like No Reins?</h3>
              <p className="text-stone-400">
                No Reins is a single half-day, built around what a horse can show you about yourself. This is about the horse itself — handling, care, what owning one actually involves — in case you want to keep going.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
