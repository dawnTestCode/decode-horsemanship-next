'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Heart, Clock, MapPin, ArrowRight, Check } from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';

export default function WomensRetreatPage() {
  const { loading, getProgram, formatDate, formatTime, getSpotsRemaining } = usePrograms([
    'womens-retreat',
  ]);

  const womensRetreat = getProgram('womens-retreat');

  return (
    <>
      {/* Hero - Full Width Infographic */}
      <section className="w-full">
        <div className="relative w-full" style={{ aspectRatio: '21/9' }}>
          <Image
            src="/no-reins/no-reins-hero.jpg"
            alt="No Reins - A Half-Day Retreat for Women"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Main Content - Two Columns */}
      <section className="py-16 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                What the Horse <span className="text-amber-500">Knows</span>
              </h1>

              <div className="prose prose-invert prose-stone max-w-none">
                <p className="text-lg text-stone-300 mb-6">
                  The people in your life hear your words. Horses feel your truth.
                </p>

                <p className="text-stone-400 mb-6">
                  This half-day retreat invites women to step away from the noise—the titles,
                  the to-do lists, the roles we play—and into the arena with horses who respond
                  only to what&apos;s real.
                </p>

                <p className="text-stone-400 mb-8">
                  No riding. No experience necessary. Just presence, honesty, and the kind of
                  feedback that only a 1,000-pound animal can give you.
                </p>
              </div>

              {/* What to Expect */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-stone-200 mb-4">What to Expect</h3>
                <ul className="space-y-3">
                  {[
                    'Ground-based exercises with horses (no riding)',
                    'Guided reflection and group discussion',
                    'Insights into your presence, boundaries, and energy',
                    'A safe space to explore without judgment',
                    'Light refreshments included',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-400">
                      <Check size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Details */}
              <div className="bg-stone-800/50 p-6 rounded-xl border border-stone-700 space-y-4">
                <div className="flex items-center gap-3 text-stone-300">
                  <Clock size={20} className="text-amber-500" />
                  <span>Half-day experience (approx. 4 hours)</span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <Users size={20} className="text-amber-500" />
                  <span>4 to {womensRetreat?.max_capacity || 8} participants — intimate by design</span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <Heart size={20} className="text-amber-500" />
                  <span className="font-semibold">{womensRetreat?.price_label || '$225'} per participant</span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <MapPin size={20} className="text-amber-500" />
                  <span>Chapel Hill, NC</span>
                </div>
              </div>
            </div>

            {/* Right Column - Upcoming Dates */}
            <div>
              <h2 className="text-2xl font-bold text-stone-200 mb-6">Upcoming Retreats</h2>

              {!loading && womensRetreat?.dates && womensRetreat.dates.length > 0 ? (
                <div className="space-y-4">
                  {womensRetreat.dates.slice(0, 3).map((date) => {
                    const spotsRemaining = getSpotsRemaining(date, womensRetreat);
                    const isFull = spotsRemaining <= 0;
                    return (
                      <div
                        key={date.id}
                        className="bg-stone-800/50 p-6 rounded-xl border border-stone-700 hover:border-amber-900/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar size={18} className="text-amber-500" />
                              <span className="font-semibold text-lg text-stone-200">
                                {formatDate(date.start_date)}
                              </span>
                            </div>
                            {date.start_time && (
                              <div className="text-stone-400 flex items-center gap-2 ml-6">
                                <span>{formatTime(date.start_time)} - {formatTime(date.end_time)}</span>
                              </div>
                            )}
                          </div>
                          <div className={`text-sm px-3 py-1 rounded-full font-medium ${
                            isFull
                              ? 'bg-red-900/30 text-red-400'
                              : spotsRemaining <= 2
                                ? 'bg-amber-900/30 text-amber-400'
                                : 'bg-green-900/30 text-green-400'
                          }`}>
                            {isFull ? 'Sold Out' : `${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} left`}
                          </div>
                        </div>
                        {!isFull ? (
                          <Link
                            href={`/eal/womens-retreat/register?date=${date.start_date}`}
                            className="block w-full px-4 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors text-center"
                          >
                            Reserve Your Spot
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="block w-full px-4 py-3 bg-stone-700 text-stone-400 font-semibold rounded-lg cursor-not-allowed text-center"
                          >
                            Sold Out
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {womensRetreat.dates.length > 3 && (
                    <p className="text-center text-stone-500 text-sm mt-4">
                      + {womensRetreat.dates.length - 3} more date{womensRetreat.dates.length - 3 !== 1 ? 's' : ''} available
                    </p>
                  )}
                </div>
              ) : !loading ? (
                <div className="bg-stone-800/50 p-8 rounded-xl border border-stone-700 text-center">
                  <p className="text-stone-400 mb-2">No upcoming dates scheduled yet.</p>
                  <p className="text-stone-500 text-sm mb-6">Join the waitlist to be notified when new dates are added.</p>
                  <Link
                    href="/eal/womens-retreat/register"
                    className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    Join the Waitlist
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-stone-800/50 p-6 rounded-xl border border-stone-700 animate-pulse">
                      <div className="h-6 bg-stone-700 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-stone-700 rounded w-1/3 mb-4"></div>
                      <div className="h-12 bg-stone-700 rounded"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQ or Additional Info */}
              <div className="mt-8 p-6 bg-amber-900/10 rounded-xl border border-amber-900/30">
                <h3 className="font-semibold text-amber-400 mb-3">Perfect for you if...</h3>
                <ul className="space-y-2 text-stone-400 text-sm">
                  <li>• You&apos;re feeling disconnected from yourself</li>
                  <li>• You want honest feedback without judgment</li>
                  <li>• You&apos;re navigating a transition or seeking clarity</li>
                  <li>• You&apos;re curious about equine-assisted learning</li>
                </ul>
              </div>

              {/* Contact CTA */}
              <div className="mt-6 text-center">
                <p className="text-stone-500 text-sm mb-2">Have questions?</p>
                <Link
                  href="/eal/contact"
                  className="text-amber-500 hover:text-amber-400 font-medium inline-flex items-center gap-1"
                >
                  Get in touch
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-xl md:text-2xl text-stone-300 italic mb-6">
            &quot;I came looking for answers and left with something better—the confidence
            to trust my own knowing.&quot;
          </blockquote>
          <p className="text-stone-500">— Retreat Participant</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-stone-900/30 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to find out what the horse knows?
          </h2>
          <p className="text-stone-400 mb-8">
            Join us for a morning of discovery, connection, and honest reflection.
          </p>
          <Link
            href={womensRetreat?.dates?.[0] ? `/eal/womens-retreat/register?date=${womensRetreat.dates[0].start_date}` : '/eal/womens-retreat/register'}
            className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2 text-lg"
          >
            Reserve Your Spot
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
