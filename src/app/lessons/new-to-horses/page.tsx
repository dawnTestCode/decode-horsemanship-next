'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function NewToHorsesPage() {
  return (
    <div className="bg-[#0C0A09]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4" style={{ background: 'linear-gradient(180deg, #0C0A09 0%, #1A0B0E 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#f5f0e8] leading-tight mb-8 tracking-tight">
            You don&apos;t have to already own a horse to start.
          </h1>
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <p className="text-lg md:text-xl text-stone-400 max-w-3xl mx-auto">
            You don&apos;t need to have grown up on one either.
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
              <span>You never had a horse growing up. You still think about it more than you&apos;d admit.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#9E1B32]">—</span>
              <span>You&apos;ve stood at a fence and wondered what it would feel like, and never taken the next step.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#9E1B32]">—</span>
              <span>You&apos;re not sure you want to own a horse. You just want to know if the pull you feel is real.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#9E1B32]">—</span>
              <span>You don&apos;t want a performance, a test, or a class where everyone else already knows what they&apos;re doing.</span>
            </li>
          </ul>
        </section>

        {/* What It Is */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHAT IT IS</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Low-stakes, one-on-one time with a horse and someone who can answer your actual questions. Not a lesson in the school sense. Not a retreat. A real, unhurried look at what this is actually like.
          </p>
        </section>

        {/* What Happens */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHAT HAPPENS</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            You show up. No riding required, unless and until you want to work toward it. We start on the ground — haltering, leading, grooming, learning to read what a horse is actually telling you. You find out what this feels like, not what it looks like online.
          </p>
        </section>

        {/* The Practical Part */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-10">THE PRACTICAL PART</h2>

          <div className="bg-[#9E1B32]/10 border-y border-[#9E1B32]/20 py-10 -mx-4 px-4 mb-10">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">~1 hr</div>
                <div className="text-stone-400 text-sm">Per Lesson</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Our Farm</div>
                <div className="text-stone-400 text-sm">Chapel Hill</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Private</div>
                <div className="text-stone-400 text-sm">Just You</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">Flexible</div>
                <div className="text-stone-400 text-sm">Start with One</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">$125</div>
                <div className="text-stone-400 text-sm">Per Lesson</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#9E1B32] mb-2">$450</div>
                <div className="text-stone-400 text-sm">4-Lesson Package</div>
              </div>
            </div>
          </div>

          <p className="text-stone-400 text-center mb-10">
            8-lesson package: $850.
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
            Dawn, founder of Decode Horsemanship. She&apos;s worked with horses every day for years, and with people for longer than that. She&apos;s not selling a method. She&apos;s telling you what&apos;s true for your horse, or the horse you haven&apos;t met yet.
          </p>
        </section>

        {/* Questions */}
        <section className="py-16">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-10">QUESTIONS</h2>
          <Accordion type="single" collapsible className="max-w-3xl">
            <AccordionItem value="item-1" className="border-stone-800">
              <AccordionTrigger className="text-[#f5f0e8] hover:text-[#9E1B32] text-left">
                Do I have to know I want a horse before I book this?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400">
                No. Most people who book this don&apos;t know yet. That&apos;s the point.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-stone-800">
              <AccordionTrigger className="text-[#f5f0e8] hover:text-[#9E1B32] text-left">
                What if I try it and decide it&apos;s not for me?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400">
                Then you&apos;ll know, and you&apos;ll know for real reasons instead of guesses. That&apos;s a good outcome too.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-stone-800">
              <AccordionTrigger className="text-[#f5f0e8] hover:text-[#9E1B32] text-left">
                Is this like No Reins?
              </AccordionTrigger>
              <AccordionContent className="text-stone-400">
                No Reins is a single half-day, built around what a horse can show you about yourself. This is about the horse itself — handling, care, what owning one actually involves — in case you want to keep going.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

      </div>
    </div>
  );
}
