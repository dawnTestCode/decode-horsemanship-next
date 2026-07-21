'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function KidsLessonsPage() {
  return (
    <div className="bg-[#0c0a09]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4" style={{ background: 'linear-gradient(180deg, #0c0a09 0%, #150c0c 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] uppercase mb-6">
            Kids & Family Lessons · Ages 5–15
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#f5f0eb] leading-tight mb-8 tracking-tight">
            Let your kid grow up around horses.
          </h1>
          <p className="text-lg md:text-xl text-[#b8a8a0] max-w-3xl mx-auto mb-10">
            Real responsibility. Real animals. Real confidence — whether they&apos;re leading their first pony or riding independently.
          </p>
          <Link
            href="/kids-lessons/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#dc143c] hover:bg-[#b01030] text-white font-semibold rounded-lg transition-colors"
          >
            Book a Trial Lesson
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">

        {/* Why Horses - 3 Column Strip */}
        <section className="py-16 border-b border-[#3a2020]">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">WHY HORSES</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#150c0c] rounded-xl border border-[#2a1818]">
              <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Confidence</h3>
              <p className="text-[#b8a8a0]">
                Leading and handling a 1,000-lb animal builds a kind of self-assurance nothing else does.
              </p>
            </div>
            <div className="p-6 bg-[#150c0c] rounded-xl border border-[#2a1818]">
              <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Responsibility</h3>
              <p className="text-[#b8a8a0]">
                Grooming, tacking, and care come before riding — real chores, real ownership.
              </p>
            </div>
            <div className="p-6 bg-[#150c0c] rounded-xl border border-[#2a1818]">
              <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Real Learning</h3>
              <p className="text-[#b8a8a0]">
                Counts toward homeschool PE, science, and life-skills credit — ask us for documentation.
              </p>
            </div>
          </div>
        </section>

        {/* Two Tracks By Age */}
        <section className="py-16 border-b border-[#3a2020]">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">TWO TRACKS, BY AGE</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-[#150c0c] rounded-xl border border-[#2a1818]">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#dc143c] uppercase mb-4 block">
                Ages 5–9
              </span>
              <h3 className="text-2xl font-serif text-[#f5f0eb] mb-4">Little Hooves</h3>
              <p className="text-[#b8a8a0] leading-relaxed">
                Ground work, leading, grooming, and basic safety. Short, hands-on sessions matched to a patient, kid-tested horse. No riding pressure — most kids aren&apos;t ready for that yet, and that&apos;s the point.
              </p>
            </div>
            <div className="p-8 bg-[#150c0c] rounded-xl border border-[#2a1818]">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#dc143c] uppercase mb-4 block">
                Ages 10–15
              </span>
              <h3 className="text-2xl font-serif text-[#f5f0eb] mb-4">Junior Horsemanship</h3>
              <p className="text-[#b8a8a0] leading-relaxed">
                More independence on the ground, and a riding progression for kids who are ready. Ties into our milestone system — Foundation through Mastery — so progress is visible.
              </p>
            </div>
          </div>
        </section>

        {/* Choose a Format */}
        <section className="py-16 border-b border-[#3a2020]">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">CHOOSE A FORMAT</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#150c0c] rounded-xl border border-[#2a1818]">
              <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Private Lesson</h3>
              <p className="text-[#b8a8a0]">
                One-on-one, fully paced to your kid.
              </p>
            </div>
            <div className="p-6 bg-[#150c0c] rounded-xl border border-[#2a1818]">
              <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Small Group</h3>
              <p className="text-[#b8a8a0]">
                2–4 kids, friends or siblings welcome.
              </p>
            </div>
            {/* Priority offering - highlighted in crimson */}
            <div className="p-6 bg-[#dc143c]/10 rounded-xl border-2 border-[#dc143c]">
              <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Homeschool Group Block</h3>
              <p className="text-[#b8a8a0]">
                Weekly class for homeschool co-ops and families.
              </p>
            </div>
          </div>
        </section>

        {/* For Parents - Reassurance Strip */}
        <section className="py-16 border-b border-[#3a2020]">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">FOR PARENTS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-serif text-[#f5f0eb] mb-2">Supervision</h3>
              <p className="text-[#b8a8a0]">
                Every session is instructor-led, one-on-one attention even in groups.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif text-[#f5f0eb] mb-2">Matched Horses</h3>
              <p className="text-[#b8a8a0]">
                Every kid is paired with a horse suited to their size, confidence, and pace.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif text-[#f5f0eb] mb-2">First Lesson</h3>
              <p className="text-[#b8a8a0]">
                No riding on day one — we start with trust, on the ground, together.
              </p>
            </div>
          </div>
        </section>

        {/* Meet a Kid-Friendly Horse */}
        <section className="py-16 border-b border-[#3a2020]">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">MEET A KID-FRIENDLY HORSE</h2>
          <div className="max-w-2xl">
            <div className="bg-[#150c0c] border border-[#2a1818] rounded-lg overflow-hidden">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/horses/ethan.jpeg"
                  alt="Ethan, a steady and forgiving horse perfect for kids"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-[#f5f0eb] mb-2">Ethan</h3>
                <p className="text-[#b8a8a0]">
                  Steady, forgiving, doesn&apos;t spook easy — a favorite first horse for kids building confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#f5f0eb] mb-8">
            Ready to see if it&apos;s a fit?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kids-lessons/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#dc143c] hover:bg-[#b01030] text-white font-semibold rounded-lg transition-colors"
            >
              Book a Trial Lesson
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/lessons/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#3a2020] hover:border-[#dc143c] text-[#f5f0eb] hover:text-[#dc143c] font-semibold rounded-lg transition-colors"
            >
              Schedule a Farm Tour
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
