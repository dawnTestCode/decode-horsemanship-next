'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Duotone filter CSS for crimson + black brand constraint
// Removes color, applies crimson tint via sepia + hue-rotate
// Brightness kept high since opacity handles visibility
const duotoneFilter = 'grayscale(100%) sepia(30%) hue-rotate(300deg) saturate(200%)';
const duotoneFilterStrong = 'grayscale(100%) sepia(40%) hue-rotate(300deg) saturate(250%)';

export default function KidsLessonsPage() {
  return (
    <div className="bg-[#0c0a09]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0c0a09 0%, #150c0c 100%)' }}>
        {/* Hero background image - IMG_3327.jpeg */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/kids-lessons/IMG_3327.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
            filter: duotoneFilter,
          }}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0c0a09]/60 via-[#0c0a09]/40 to-[#150c0c]/60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
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
        <section className="relative py-16 border-b border-[#3a2020] overflow-hidden">
          {/* Background image - IMG_5933.jpeg (heavy green, needs strong duotone) */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(/kids-lessons/IMG_5933.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 15%',
              backgroundRepeat: 'no-repeat',
              opacity: 0.18,
              filter: duotoneFilterStrong,
            }}
          />
          <div className="relative z-10">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">WHY HORSES</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-[#150c0c]/90 backdrop-blur-sm rounded-xl border border-[#2a1818]">
                <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Confidence</h3>
                <p className="text-[#b8a8a0]">
                  Leading and handling a 1,000-lb animal builds a kind of self-assurance nothing else does.
                </p>
              </div>
              <div className="p-6 bg-[#150c0c]/90 backdrop-blur-sm rounded-xl border border-[#2a1818]">
                <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Responsibility</h3>
                <p className="text-[#b8a8a0]">
                  Grooming, tacking, and care come before riding — real chores, real ownership.
                </p>
              </div>
              <div className="p-6 bg-[#150c0c]/90 backdrop-blur-sm rounded-xl border border-[#2a1818]">
                <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Real Learning</h3>
                <p className="text-[#b8a8a0]">
                  Counts toward homeschool PE, science, and life-skills credit — ask us for documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Two Tracks By Age */}
        <section className="py-16 border-b border-[#3a2020]">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">TWO TRACKS, BY AGE</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Little Hooves Card - with corner/edge bleed background */}
            <div className="relative p-8 bg-[#150c0c] rounded-xl border border-[#2a1818] overflow-hidden">
              {/* Background image - IMG_4784.jpeg (built-in blur, ideal for this treatment) */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'url(/kids-lessons/IMG_4784.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'right 20%',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.2,
                  filter: duotoneFilter,
                }}
              />
              <div className="relative z-10">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#dc143c] uppercase mb-4 block">
                  Ages 5–9
                </span>
                <h3 className="text-2xl font-serif text-[#f5f0eb] mb-4">Little Hooves</h3>
                <p className="text-[#b8a8a0] leading-relaxed">
                  Ground work, leading, grooming, and basic safety. Short, hands-on sessions matched to a patient, kid-tested horse. No riding pressure — most kids aren&apos;t ready for that yet, and that&apos;s the point.
                </p>
              </div>
            </div>
            {/* Junior Horsemanship Card - distinct crop from Little Hooves */}
            <div className="relative p-8 bg-[#150c0c] rounded-xl border border-[#2a1818] overflow-hidden">
              {/* Background image - IMG_4861.jpeg (bare trees, clean, low green) */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'url(/kids-lessons/IMG_4861.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'left 20%',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.2,
                  filter: duotoneFilter,
                }}
              />
              <div className="relative z-10">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#dc143c] uppercase mb-4 block">
                  Ages 10–15
                </span>
                <h3 className="text-2xl font-serif text-[#f5f0eb] mb-4">Junior Horsemanship</h3>
                <p className="text-[#b8a8a0] leading-relaxed">
                  More independence on the ground, and a riding progression for kids who are ready. Ties into our milestone system — Foundation through Mastery — so progress is visible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Choose a Format */}
        <section className="py-16 border-b border-[#3a2020]">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">CHOOSE A FORMAT</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Private Lesson - IMG_3315.jpeg */}
            <Link
              href="/kids-lessons/book/private"
              className="group relative p-6 bg-[#150c0c] rounded-xl border border-[#2a1818] hover:border-[#dc143c] transition-colors overflow-hidden"
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'url(/kids-lessons/IMG_3315.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.15,
                  filter: duotoneFilter,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-xl font-serif text-[#f5f0eb] mb-3 group-hover:text-[#dc143c] transition-colors">Private Lesson</h3>
                <p className="text-[#b8a8a0] mb-4">
                  One-on-one, fully paced to your kid.
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-[#dc143c]">
                  Book now <ArrowRight size={14} />
                </span>
              </div>
            </Link>
            {/* Small Group - IMG_6979.jpeg */}
            <Link
              href="/kids-lessons/book/small-group"
              className="group relative p-6 bg-[#150c0c] rounded-xl border border-[#2a1818] hover:border-[#dc143c] transition-colors overflow-hidden"
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'url(/kids-lessons/IMG_6979.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.15,
                  filter: duotoneFilter,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-xl font-serif text-[#f5f0eb] mb-3 group-hover:text-[#dc143c] transition-colors">Small Group</h3>
                <p className="text-[#b8a8a0] mb-4">
                  2–4 kids, friends or siblings welcome.
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-[#dc143c]">
                  Book now <ArrowRight size={14} />
                </span>
              </div>
            </Link>
            {/* Priority offering - highlighted in crimson - IMG_7087.jpeg */}
            <Link
              href="/kids-lessons/book/homeschool"
              className="group relative p-6 bg-[#dc143c]/10 rounded-xl border-2 border-[#dc143c] hover:bg-[#dc143c]/20 transition-colors overflow-hidden"
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'url(/kids-lessons/IMG_7087.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.15,
                  filter: duotoneFilter,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-xl font-serif text-[#f5f0eb] mb-3">Homeschool Group Block</h3>
                <p className="text-[#b8a8a0] mb-4">
                  Weekly class for homeschool co-ops and families.
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-[#dc143c]">
                  Book now <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* For Parents - Reassurance Strip */}
        <section className="relative py-16 border-b border-[#3a2020] overflow-hidden">
          {/* Background image - FullSizeRender-2.jpeg (warm neutral tones, minimal green - lightest touch) */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(/kids-lessons/FullSizeRender-2.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat',
              opacity: 0.12,
              filter: duotoneFilter,
            }}
          />
          <div className="relative z-10">
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
          </div>
        </section>

        {/* Meet a Kid-Friendly Horse */}
        <section className="relative py-16 border-b border-[#3a2020] overflow-hidden">
          {/* Background image - IMG_5006.jpeg (heavy green, needs strong correction) */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(/kids-lessons/IMG_5006.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat',
              opacity: 0.25,
              filter: duotoneFilterStrong,
            }}
          />
          <div className="relative z-10">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] mb-10">MEET A KID-FRIENDLY HORSE</h2>
            <div className="max-w-2xl">
              <div className="bg-[#150c0c]/90 backdrop-blur-sm border border-[#2a1818] rounded-lg overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/horses/ethan.jpeg"
                    alt="Ethan, a steady and forgiving horse perfect for kids"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 30%' }}
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
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative py-20 text-center overflow-hidden">
          {/* Very faint background - FullSizeRender.jpeg cropped tight behind button area only */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(/kids-lessons/FullSizeRender.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 25%',
              backgroundRepeat: 'no-repeat',
              opacity: 0.1,
              filter: duotoneFilter,
            }}
          />
          <div className="relative z-10">
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
          </div>
        </section>

      </div>
    </div>
  );
}
