'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, MapPin, Clock, ArrowRight } from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';

export default function NoReinsPage() {
  const { loading, getProgram, formatDate, formatTime, getSpotsRemaining } = usePrograms([
    'womens-retreat',
  ]);

  const womensRetreat = getProgram('womens-retreat');

  return (
    <div className="bg-[#1a1d24]">
      {/* Hero - Full Width Infographic */}
      <section className="w-full">
        {/* Desktop hero - 21:9 aspect ratio */}
        <div className="hidden md:block relative w-full" style={{ aspectRatio: '21/9' }}>
          <Image
            src="/no-reins/no-reins-hero.png"
            alt="No Reins — A half-day retreat for women at Decode Horsemanship"
            fill
            className="object-cover object-left"
            priority
          />
        </div>
        {/* Mobile hero - taller aspect ratio */}
        <div className="md:hidden relative w-full" style={{ aspectRatio: '3/4' }}>
          <Image
            src="/no-reins/no-reins-hero-mobile.png"
            alt="No Reins — A half-day retreat for women at Decode Horsemanship"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">

        {/* Section 1 — Opening line */}
        <section className="py-20 md:py-28 border-b border-stone-800">
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#f5f0e8] leading-relaxed max-w-4xl">
            Some women have done all the right things and have started to feel like everyone else in their life is holding the reins.
          </p>
          <p className="text-lg md:text-xl font-serif italic text-stone-500 mt-6">
            That&apos;s all. That&apos;s enough.
          </p>
        </section>

        {/* Two Column Layout for main content + booking */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 py-16">

          {/* Left Column - Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-16">

            {/* Section 2 — What it is */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">WHAT IT IS</h2>
              <p className="text-lg text-stone-300 mb-4">
                A half-day at a working horse farm in Chapel Hill, North Carolina.
              </p>
              <p className="text-lg text-stone-300 mb-6">
                A small group of women. Four horses. No riding. Coffee in the morning, real food at midday.
              </p>
              <p className="text-lg font-serif italic text-stone-500">
                No journaling prompts. No sharing circle. No one will ask you to set an intention.
              </p>
            </section>

            {/* Section 3 — Who it's for */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">WHO IT&apos;S FOR</h2>
              <ul className="space-y-4 text-lg text-stone-300">
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>The woman who is fine, and is tired of being fine.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>The woman who can read everyone else in the room but has stopped reading herself.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>The woman who is good at her job and good at her people and quietly running on empty.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>The woman who would never call this a retreat to her friends. <em className="text-stone-500">Especially her.</em></span>
                </li>
              </ul>
            </section>

            {/* Section 4 — What happens */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">WHAT HAPPENS</h2>
              <div className="space-y-4 text-lg text-stone-300">
                <p>You arrive. You don&apos;t have to be anyone yet.</p>
                <p>You watch the herd for a while. No agenda.</p>
                <p>You go into a round pen with a horse. No saddle, no bridle, no reins. You and her, and whatever you brought with you.</p>
                <p>She tells you the truth. You leave with it.</p>
              </div>
            </section>

            {/* Section 5 — The shape of the morning */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">THE SHAPE OF THE MORNING</h2>
              <div className="space-y-6">
                <div className="flex gap-6 border-l-2 border-amber-600/30 pl-6">
                  <div>
                    <p className="font-semibold text-[#f5f0e8] mb-1">First hour</p>
                    <p className="text-stone-400 italic">Coffee. The herd. You&apos;re allowed to just watch.</p>
                  </div>
                </div>
                <div className="flex gap-6 border-l-2 border-amber-600/30 pl-6">
                  <div>
                    <p className="font-semibold text-[#f5f0e8] mb-1">Middle hour</p>
                    <p className="text-stone-400 italic">One horse. No tack. Just you, asking — without words — for her to walk with you.</p>
                  </div>
                </div>
                <div className="flex gap-6 border-l-2 border-amber-600/30 pl-6">
                  <div>
                    <p className="font-semibold text-[#f5f0e8] mb-1">Closing hour</p>
                    <p className="text-stone-400 italic">A meal together. We talk if you want to. Otherwise we don&apos;t.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 — The horses */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">THE HORSES</h2>
              <div className="space-y-4 text-lg text-stone-300">
                <p>The horses you&apos;ll meet are part of the Decode herd. Some came here rescued. Some came here broken. All of them have learned, with time, what a quiet human feels like.</p>
                <p>They&apos;re not props. They&apos;re not trained to do anything in particular with you. They will respond to whoever you actually are when you walk through the gate. That&apos;s the whole point.</p>
              </div>
            </section>

            {/* Section 7 — What you don't have to do */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">WHAT YOU DON&apos;T HAVE TO DO</h2>
              <ul className="space-y-3 text-lg text-stone-300">
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>You don&apos;t have to ride.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>You don&apos;t have to share anything about your life.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>You don&apos;t have to cry, or not cry.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>You don&apos;t have to know anything about horses.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">—</span>
                  <span>You don&apos;t have to be &quot;ready.&quot;</span>
                </li>
              </ul>
            </section>

            {/* Section 8 — Pull quote (placeholder) */}
            {/* TODO: Replace with real participant testimonial when available */}
            {/*
            <section className="py-8 border-y border-stone-800">
              <blockquote className="text-xl md:text-2xl font-serif italic text-stone-400">
                "I came in thinking I needed a break. I left realizing I'd been holding my breath for about a year."
              </blockquote>
              <p className="text-stone-600 mt-4">— A participant, fall 2026</p>
              <p className="text-xs text-stone-700 italic mt-2">Placeholder — to be replaced with a real participant quote.</p>
            </section>
            */}

            {/* Section 9 — The practical part */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">THE PRACTICAL PART</h2>
              <div className="space-y-4">
                <div className="flex gap-4 py-3 border-b border-stone-800">
                  <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">When</span>
                  <span className="text-stone-400">The third Saturday of every month. 10:00 AM – 2:00 PM.</span>
                </div>
                <div className="flex gap-4 py-3 border-b border-stone-800">
                  <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Where</span>
                  <span className="text-stone-400">Decode Horsemanship, Chapel Hill, NC. Directions sent on booking.</span>
                </div>
                <div className="flex gap-4 py-3 border-b border-stone-800">
                  <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Group size</span>
                  <span className="text-stone-400">Four to eight women.</span>
                </div>
                <div className="flex gap-4 py-3 border-b border-stone-800">
                  <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">What to bring</span>
                  <span className="text-stone-400">Boots or closed-toe shoes. Long pants. A jacket in the cooler months.</span>
                </div>
                <div className="flex gap-4 py-3 border-b border-stone-800">
                  <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">Lunch</span>
                  <span className="text-stone-400">Included. Real food.</span>
                </div>
                <div className="flex gap-4 py-3 border-b border-stone-800">
                  <span className="font-semibold text-[#f5f0e8] w-32 flex-shrink-0">What it costs</span>
                  <span className="text-stone-400">$375. Deposit holds your spot.</span>
                </div>
              </div>
            </section>

            {/* Section 10 — Who runs it */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">WHO RUNS IT</h2>
              <p className="text-lg text-stone-300">
                Dawn — founder of Decode Horsemanship. She&apos;s worked with horses every day for years and with people in leadership for longer than that. She&apos;ll be in the round pen with you. She doesn&apos;t perform. She doesn&apos;t push. She&apos;ll be there if you need her and out of the way if you don&apos;t.
              </p>
            </section>

            {/* Section 11 — Other programs at Decode */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">OTHER PROGRAMS AT DECODE</h2>
              <div className="space-y-4">
                <Link href="/eal/groundwork" className="block p-4 bg-stone-900/50 rounded-lg border border-stone-800 hover:border-amber-900/50 transition-colors">
                  <p className="font-semibold text-[#f5f0e8]">Groundwork</p>
                  <p className="text-stone-500 text-sm">A day for men, second Saturday of the month.</p>
                </Link>
                <Link href="/eal/dust-and-leather" className="block p-4 bg-stone-900/50 rounded-lg border border-stone-800 hover:border-amber-900/50 transition-colors">
                  <p className="font-semibold text-[#f5f0e8]">Dust & Leather</p>
                  <p className="text-stone-500 text-sm">A working ranch day for men, first Saturday of the month.</p>
                </Link>
                <Link href="/mustangs" className="block p-4 bg-stone-900/50 rounded-lg border border-stone-800 hover:border-amber-900/50 transition-colors">
                  <p className="font-semibold text-[#f5f0e8]">Mustang Immersion</p>
                  <p className="text-stone-500 text-sm">Three days with a mustang, a few times a year.</p>
                </Link>
              </div>
            </section>

          </div>

          {/* Right Column - Booking (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-xs font-semibold tracking-[0.2em] text-amber-600 mb-6">UPCOMING DATES</h3>

              {!loading && womensRetreat?.dates && womensRetreat.dates.length > 0 ? (
                <div className="space-y-4">
                  {womensRetreat.dates.slice(0, 3).map((date) => {
                    const spotsRemaining = getSpotsRemaining(date, womensRetreat);
                    const isFull = spotsRemaining <= 0;
                    return (
                      <div
                        key={date.id}
                        className="bg-stone-900/50 p-5 rounded-xl border border-stone-800"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-[#f5f0e8]">{formatDate(date.start_date)}</div>
                            {date.start_time && (
                              <div className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                                <Clock size={14} />
                                {formatTime(date.start_time)} – {formatTime(date.end_time)}
                              </div>
                            )}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${isFull ? 'bg-stone-800 text-stone-500' : 'bg-amber-900/20 text-amber-600'}`}>
                            {isFull ? 'Full' : `${spotsRemaining} spots`}
                          </div>
                        </div>
                        {!isFull && (
                          <Link
                            href={`/eal/womens-retreat/register?date=${date.start_date}`}
                            className="block w-full px-4 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors text-center text-sm"
                          >
                            Reserve Your Spot
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : !loading ? (
                <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 text-center">
                  <p className="text-stone-500 text-sm mb-4">No upcoming dates scheduled yet.</p>
                  <Link
                    href="/eal/contact"
                    className="text-amber-600 hover:text-amber-500 font-medium text-sm inline-flex items-center gap-1"
                  >
                    Get notified
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-stone-900/50 p-5 rounded-xl border border-stone-800 animate-pulse">
                      <div className="h-5 bg-stone-800 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-stone-800 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact link */}
              <div className="mt-8 pt-6 border-t border-stone-800">
                <p className="text-stone-600 text-sm mb-2">Questions?</p>
                <Link
                  href="/eal/contact"
                  className="text-amber-600 hover:text-amber-500 font-medium text-sm inline-flex items-center gap-1"
                >
                  Get in touch
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
