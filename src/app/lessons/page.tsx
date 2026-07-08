'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LessonsPage() {
  return (
    <div className="bg-[#0C0A09]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4" style={{ background: 'linear-gradient(180deg, #0C0A09 0%, #1A0B0E 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#f5f0e8] leading-tight mb-8 tracking-tight">
            Not all horse girls start as little girls.
          </h1>
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <p className="text-lg md:text-xl text-stone-400 max-w-3xl mx-auto">
            Some people have wanted this their whole life and never said it out loud. Some just brought a horse home last month and have no idea what they&apos;re doing. Both of you are in the right place.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">

        {/* What It Is */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHAT IT IS</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Private, one-on-one lessons in natural horsemanship. Not a one-day event. Not a retreat. Ongoing instruction, roughly an hour at a time, built around wherever you actually are.
          </p>
        </section>

        {/* Two Ways In */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-10">TWO WAYS IN</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Door 1 - Already have a horse */}
            <Link
              href="/lessons/decode-the-noise"
              className="group relative block p-8 bg-stone-900/30 border-2 border-[#9E1B32]/30 hover:border-[#9E1B32] transition-all duration-300"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#9E1B32] uppercase mb-4 block">
                Door One
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-[#f5f0e8] mb-4 leading-snug">
                Already have a horse?
              </h3>
              <p className="text-stone-400 mb-8 leading-relaxed">
                Between the internet, the barn aisle, and three conflicting trainers, you don&apos;t need one more opinion. You need someone to decode the noise.
              </p>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9E1B32] hover:bg-[#7a1527] text-white font-medium transition-colors">
                Decode the Noise
                <ArrowRight size={18} />
              </span>
            </Link>

            {/* Door 2 - Never had one */}
            <Link
              href="/lessons/new-to-horses"
              className="group relative block p-8 bg-stone-900/30 border-2 border-[#9E1B32]/30 hover:border-[#9E1B32] transition-all duration-300"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#9E1B32] uppercase mb-4 block">
                Door Two
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-[#f5f0e8] mb-4 leading-snug">
                Never had one, but you think about it more than you say out loud?
              </h3>
              <p className="text-stone-400 mb-8 leading-relaxed">
                You don&apos;t have to already own a horse to start.
              </p>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9E1B32] hover:bg-[#7a1527] text-white font-medium transition-colors">
                Start Here
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </section>

        {/* Who Runs It */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHO RUNS IT</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Dawn — founder of Decode Horsemanship. She&apos;s worked with horses every day for years, and with people for longer than that. She&apos;s not selling a method. She&apos;s telling you what&apos;s true for your horse, or the horse you haven&apos;t met yet.
          </p>
        </section>

        {/* The Practical Part */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-10">THE PRACTICAL PART</h2>

          <div className="bg-[#9E1B32]/10 border-y border-[#9E1B32]/20 py-10 -mx-4 px-4 mb-10">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">~1 hr</div>
                <div className="text-stone-400 text-sm">Per Lesson</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Private</div>
                <div className="text-stone-400 text-sm">One Household</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Flexible</div>
                <div className="text-stone-400 text-sm">Weekly / Biweekly</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">$125</div>
                <div className="text-stone-400 text-sm">Per Lesson</div>
              </div>
            </div>
          </div>

          <p className="text-stone-400 text-center mb-10">
            Packages available — see each door for details.
          </p>

          <div className="text-center">
            <Link
              href="/lessons/book"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#9E1B32] hover:bg-[#7a1527] text-white font-medium transition-colors"
            >
              Book a Lesson
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Other Ways to Start */}
        <section className="py-16">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">OTHER WAYS TO START</h2>
          <p className="text-lg text-stone-300 mb-4">
            Not ready for lessons yet? <Link href="/no-reins" className="text-[#9E1B32] hover:text-[#b82e45] transition-colors">No Reins</Link> and <Link href="/groundwork" className="text-[#9E1B32] hover:text-[#b82e45] transition-colors">Groundwork</Link> are single-day ways to find out if this is for you.
          </p>
          <p className="text-lg text-stone-300">
            Already sure? <Link href="/" className="text-[#9E1B32] hover:text-[#b82e45] transition-colors">Meet our horses</Link> — some of them are ready to come home.
          </p>
        </section>

      </div>
    </div>
  );
}
