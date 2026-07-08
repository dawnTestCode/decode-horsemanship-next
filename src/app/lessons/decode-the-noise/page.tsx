'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DecodeTheNoisePage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f5f0e8] leading-tight mb-8">
            We&apos;ll decode the noise.
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-3xl">
            Every corner of the internet has an opinion about your horse. Most of them contradict each other. We&apos;re not here to add one more.
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
              <span>You just brought home your first horse — mini, pony, or full-size — and you&apos;re realizing owning one is nothing like watching videos about one.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500">—</span>
              <span>You&apos;ve read six methods, watched forty hours of YouTube, and joined three Facebook groups, and you trust your horse&apos;s read on you less than you did on day one.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500">—</span>
              <span>You don&apos;t want another philosophy. You want someone standing in your barn telling you what&apos;s actually true, for your horse, right now.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500">—</span>
              <span>You&apos;re not in crisis. Your horse isn&apos;t &quot;bad.&quot; You&apos;re just tired of guessing.</span>
            </li>
          </ul>
        </section>

        {/* What Happens */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-6">WHAT HAPPENS</h2>
          <div className="space-y-4 text-lg text-stone-300 max-w-3xl">
            <p>We start with what isn&apos;t working. We watch you and your horse together before we touch anything. We decode: is this a real problem, or normal horse behavior with a new-owner-shaped panic attached to it? Then we build from there — one visit, one real answer at a time.</p>
            <p>No curriculum sold in modules. No twelve-week program you have to finish to see if it works. Just what you and your horse need this week.</p>
          </div>
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
              <span className="text-stone-400">At your place — barn, backyard, boarding facility — anywhere within a 2-hour drive of Chapel Hill.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Travel</span>
              <span className="text-stone-400">Free within 30 minutes of Chapel Hill. $25 flat fee (30–60 min), $50 (60–90 min), $75 (90–120 min).</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Frequency</span>
              <span className="text-stone-400">Weekly, biweekly, or one-off.</span>
            </div>
            <div className="flex gap-4 py-3 border-b border-stone-800">
              <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Group size</span>
              <span className="text-stone-400">Private. Your household, your horse (or horses).</span>
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
            Dawn, founder of Decode Horsemanship. Before horses, she spent two decades in corporate leadership — running teams, developing people, consulting on team dynamics at the executive level. She&apos;s been training, rehabilitating, and partnering with horses for over a decade, including mustangs straight off Bureau of Land Management holdings. She&apos;s not teaching a franchised method. She&apos;s telling you what&apos;s true, for your horse, based on what she actually sees in front of her.
          </p>
        </section>

        {/* Questions */}
        <section className="py-16">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-8">QUESTIONS</h2>
          <div className="space-y-8 max-w-3xl">
            <div>
              <h3 className="font-semibold text-[#f5f0e8] mb-2">Do I need to already be doing something &quot;right&quot;?</h3>
              <p className="text-stone-400">
                No. Most people who call are doing several things right and one or two things that are quietly making everything harder. That&apos;s normal. That&apos;s what we&apos;re there to find.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#f5f0e8] mb-2">What if my horse has a real behavioral issue, not just a new-owner thing?</h3>
              <p className="text-stone-400">
                We&apos;ll tell you honestly which one it is, and what the next right step looks like — including if that step is a vet or a specialist, not us.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#f5f0e8] mb-2">Is this the same as the one-day programs (No Reins, Groundwork)?</h3>
              <p className="text-stone-400">
                No. Those are single-day experiences at the farm. This is ongoing instruction with your horse, at your place.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
