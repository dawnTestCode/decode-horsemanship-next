'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function DecodeTheNoisePage() {
  return (
    <div className="bg-[#0C0A09]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4" style={{ background: 'linear-gradient(180deg, #0C0A09 0%, #1A0B0E 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#f5f0e8] leading-tight mb-8 tracking-tight">
            We&apos;ll decode the noise.
          </h1>
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <p className="text-lg md:text-xl text-stone-400 max-w-3xl mx-auto">
            Every corner of the internet has an opinion about your horse. Most of them contradict each other. We&apos;re not here to add one more.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">

        {/* Who It's For */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHO IT&apos;S FOR</h2>
          <ul className="space-y-4 text-lg text-stone-300 max-w-3xl">
            <li className="flex gap-3">
              <span className="text-[#9E1B32]">—</span>
              <span>You just brought home your first horse — mini, pony, or full-size — and you&apos;re realizing owning one is nothing like watching videos about one.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#9E1B32]">—</span>
              <span>You&apos;ve read six methods, watched forty hours of YouTube, and joined three Facebook groups, and you trust your horse&apos;s read on you less than you did on day one.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#9E1B32]">—</span>
              <span>You don&apos;t want another philosophy. You want someone standing in your barn telling you what&apos;s actually true, for your horse, right now.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#9E1B32]">—</span>
              <span>You&apos;re not in crisis. Your horse isn&apos;t &quot;bad.&quot; You&apos;re just tired of guessing.</span>
            </li>
          </ul>
        </section>

        {/* What Happens */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHAT HAPPENS</h2>
          <div className="space-y-4 text-lg text-stone-300 max-w-3xl">
            <p>We start with what isn&apos;t working. We watch you and your horse together before we touch anything. We decode: is this a real problem, or normal horse behavior with a new-owner-shaped panic attached to it? Then we build from there — one visit, one real answer at a time.</p>
            <p>No curriculum sold in modules. No twelve-week program you have to finish to see if it works. Just what you and your horse need this week.</p>
          </div>
        </section>

        {/* The Practical Part */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-10">THE PRACTICAL PART</h2>

          <div className="bg-[#9E1B32]/10 border-y border-[#9E1B32]/20 py-10 -mx-4 px-4 mb-10">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">~2 hrs</div>
                <div className="text-stone-400 text-sm">Per Lesson</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Your Place</div>
                <div className="text-stone-400 text-sm">Within 2 hrs of Chapel Hill</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Private</div>
                <div className="text-stone-400 text-sm">Your Household</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Flexible</div>
                <div className="text-stone-400 text-sm">Weekly / Biweekly</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">$250</div>
                <div className="text-stone-400 text-sm">Per Lesson</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">$450</div>
                <div className="text-stone-400 text-sm">2-Lesson Package</div>
              </div>
            </div>
          </div>

          <p className="text-stone-400 text-center mb-10">
            Travel: Free within 30 min of Chapel Hill. $25 (30–60 min), $50 (60–90 min), $75 (90–120 min).
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

        {/* Who Runs It */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHO RUNS IT</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Dawn, founder of Decode Horsemanship. Before horses, she spent two decades in corporate leadership — running teams, developing people, consulting on team dynamics at the executive level. She&apos;s been training, rehabilitating, and partnering with horses for over a decade, including mustangs straight off Bureau of Land Management holdings. She&apos;s not teaching a franchised method. She&apos;s telling you what&apos;s true, for your horse, based on what she actually sees in front of her.
          </p>
        </section>

        {/* Questions */}
        <section className="py-16">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-10">QUESTIONS</h2>
          <Accordion type="single" collapsible className="max-w-3xl">
            <AccordionItem value="item-1" className="border-stone-800">
              <AccordionTrigger className="text-[#f5f0e8] hover:text-[#9E1B32] text-left">
                Do I need to already be doing something &quot;right&quot;?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400">
                No. Most people who call are doing several things right and one or two things that are quietly making everything harder. That&apos;s normal. That&apos;s what we&apos;re there to find.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-stone-800">
              <AccordionTrigger className="text-[#f5f0e8] hover:text-[#9E1B32] text-left">
                What if my horse has a real behavioral issue, not just a new-owner thing?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400">
                We&apos;ll tell you honestly which one it is, and what the next right step looks like — including if that step is a vet or a specialist, not us.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-stone-800">
              <AccordionTrigger className="text-[#f5f0e8] hover:text-[#9E1B32] text-left">
                Is this the same as the one-day programs (No Reins, Groundwork)?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400">
                No. Those are single-day experiences at the farm. This is ongoing instruction with your horse, at your place.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

      </div>
    </div>
  );
}
