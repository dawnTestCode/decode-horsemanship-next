'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Sun,
  CheckCircle,
  HelpCircle,
  Compass,
  Mountain,
  Loader2,
} from 'lucide-react';
import { useSummerCampSessions } from '@/hooks/useSummerCampSessions';

const weekSchedule = [
  {
    day: 'Monday',
    title: 'Meet the Herd',
    description:
      'Herd dynamics, horse behavior and body language, safe approach and haltering',
  },
  {
    day: 'Tuesday',
    title: 'Horse Anatomy & Health',
    description:
      'Parts of the horse, vital signs, basic health checks, coat and hoof care',
  },
  {
    day: 'Wednesday',
    title: 'Tack & Equipment',
    description:
      'Identifying and fitting halters, lead ropes, and grooming tools; natural horsemanship equipment intro',
  },
  {
    day: 'Thursday',
    title: 'Groundwork',
    description:
      'Leading, yielding, pressure and release, round pen basics (Trailblazers go deeper into liberty work)',
  },
  {
    day: 'Friday',
    title: 'Putting It Together',
    description:
      'Camper-led demonstration for families, certificate presentation, photo with their horse partner',
  },
];

const dailySchedule = [
  { time: '9:00am', activity: 'Arrival, barn orientation, morning feed check' },
  { time: '9:30am', activity: 'Lesson block 1 — classroom or barn' },
  { time: '10:30am', activity: 'Hands-on horse time' },
  { time: '11:30am', activity: 'Lesson block 2 — groundwork or activity' },
  { time: '12:15pm', activity: 'Wrap-up, journaling, Q&A' },
  { time: '1:00pm', activity: 'Pick-up' },
];

const faqs = [
  {
    question: 'What should my child wear?',
    answer:
      'Closed-toe shoes (boots preferred), long pants, weather-appropriate layers. No flip flops or sandals.',
  },
  {
    question: 'Do they need horse experience?',
    answer: 'No. Both tiers welcome first-timers.',
  },
  {
    question: 'What should they bring?',
    answer: 'Water bottle, sack lunch, sunscreen, a curious attitude.',
  },
  {
    question: 'Are helmets required?',
    answer:
      'Helmets are required for any in-arena groundwork activities. Loaners available.',
  },
  {
    question: 'Are there special needs accommodations?',
    answer:
      "Contact us before registering — we'll do our best to make it work.",
  },
  {
    question: "What's your allergy/medical policy?",
    answer:
      'Medical forms collected at registration. We are not a nut-free facility.',
  },
  {
    question: "What's the cancellation policy?",
    answer:
      '$100 deposit is non-refundable. Balance refunded if cancelled 14+ days before session start.',
  },
];

export default function SummerCampPage() {
  const { sessions, loading, formatDateRange, getSpotsRemaining } = useSummerCampSessions();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/30 rounded-full text-amber-400 text-sm mb-6">
            <Sun size={16} />
            Summer 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your Hands Dirty.{' '}
            <span className="text-red-500">Learn the Real Thing.</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            A natural horsemanship day camp for kids who want to understand
            horses — not just ride them. Groundwork, anatomy, tack, herd
            behavior, and hands-on horse care. No experience needed.
          </p>
          <Link
            href="/summer-camp/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            Reserve Your Spot
            <ArrowRight size={20} />
          </Link>
          <p className="text-stone-500 text-sm mt-4">
            9am – 1pm · Ages 6–14 · Chapel Hill, NC corridor
          </p>
        </div>
      </section>

      {/* Two-Tier Cards */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Explorers Card */}
            <div className="bg-stone-900/50 rounded-2xl border border-stone-800 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-900/30 to-stone-900 p-6 border-b border-stone-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-amber-900/50 rounded-full flex items-center justify-center">
                    <Compass className="text-amber-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Explorers</h3>
                    <p className="text-amber-400 text-sm">Ages 6–9</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-stone-400 mb-6">
                  Introduction to horses and the barn world. Supervised,
                  high-engagement, hands-on learning for younger campers.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Safe, age-appropriate activities</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>High staff-to-camper ratio</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Foundation in horse safety & care</span>
                  </div>
                </div>
                <div className="border-t border-stone-800 pt-4">
                  <p className="text-stone-200 font-semibold">
                    $475/week{' '}
                    <span className="text-stone-500 font-normal">
                      · $425 Early Bird
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Trailblazers Card */}
            <div className="bg-stone-900/50 rounded-2xl border border-stone-800 overflow-hidden">
              <div className="bg-gradient-to-r from-red-900/30 to-stone-900 p-6 border-b border-stone-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center">
                    <Mountain className="text-red-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Trailblazers
                    </h3>
                    <p className="text-red-400 text-sm">Ages 10–14</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-stone-400 mb-6">
                  Deeper horsemanship skills and horse psychology. More
                  independent work with leadership opportunities.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Advanced groundwork techniques</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Liberty work introduction</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Leadership & horse psychology</span>
                  </div>
                </div>
                <div className="border-t border-stone-800 pt-4">
                  <p className="text-stone-200 font-semibold">
                    $475/week{' '}
                    <span className="text-stone-500 font-normal">
                      · $425 Early Bird
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            What You&apos;ll <span className="text-red-500">Learn</span>
          </h2>
          <p className="text-stone-400 text-center mb-12 max-w-2xl mx-auto">
            Each day builds on the last, leading to a Friday demonstration
            where campers show off their new skills.
          </p>

          <div className="space-y-4">
            {weekSchedule.map((day, index) => (
              <div
                key={day.day}
                className="bg-stone-900/50 rounded-xl border border-stone-800 p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                  <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-stone-500 text-sm">{day.day}</p>
                    <p className="text-white font-semibold">{day.title}</p>
                  </div>
                </div>
                <p className="text-stone-400 md:border-l md:border-stone-700 md:pl-6">
                  {day.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Day at Camp */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            A Day at <span className="text-red-500">Camp</span>
          </h2>
          <p className="text-stone-400 text-center mb-12">
            Here&apos;s what a typical day looks like
          </p>

          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-stone-800">
              {dailySchedule.map((item) => (
                <div
                  key={item.time}
                  className="flex items-center gap-6 p-4 hover:bg-stone-800/30 transition-colors"
                >
                  <div className="w-20 flex-shrink-0">
                    <span className="text-red-500 font-mono font-semibold">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-stone-300">{item.activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Session Dates */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Session <span className="text-red-500">Dates</span>
          </h2>
          <p className="text-stone-400 text-center mb-12">
            Each session capped at 6 campers per tier (12 total max) to preserve
            the hands-on experience.
          </p>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sessions.map((session) => {
                const explorerSpots = getSpotsRemaining(session, 'explorers');
                const trailblazerSpots = getSpotsRemaining(session, 'trailblazers');
                const totalSpots = explorerSpots + trailblazerSpots;
                const isAvailable = session.status === 'open' && totalSpots > 0;
                return (
                  <div
                    key={session.id}
                    className="bg-stone-900/50 rounded-xl border border-stone-800 p-4 text-center hover:border-stone-700 transition-colors"
                  >
                    <p className="text-stone-500 text-sm mb-1">{session.name}</p>
                    <p className="text-white font-semibold">
                      {formatDateRange(session.start_date, session.end_date)}
                    </p>
                    {isAvailable ? (
                      <div className="mt-2 flex justify-center gap-2">
                        <span className="text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded">
                          {explorerSpots} Exp
                        </span>
                        <span className="text-xs text-red-400 bg-red-900/30 px-2 py-1 rounded">
                          {trailblazerSpots} TB
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block mt-2 text-xs text-stone-500 bg-stone-800 px-2 py-1 rounded">
                        {session.status === 'full' ? 'Full' : 'Closed'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/summer-camp/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Register Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pricing & <span className="text-red-500">Policies</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Pricing</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                  <span className="text-stone-400">Standard Rate</span>
                  <span className="text-white font-semibold text-lg">
                    $475/week
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                  <div>
                    <span className="text-stone-400">Early Bird</span>
                    <p className="text-stone-600 text-xs">
                      Register 60+ days out
                    </p>
                  </div>
                  <span className="text-green-400 font-semibold text-lg">
                    $425/week
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-stone-400">Sibling Discount</span>
                    <p className="text-stone-600 text-xs">Second child</p>
                  </div>
                  <span className="text-amber-400 font-semibold">$50 off</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Payment Terms
              </h3>
              <div className="space-y-4 text-stone-400">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p>
                    <span className="text-white">$100 deposit</span>{' '}
                    (non-refundable) due at registration
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p>Balance due 2 weeks before session start</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p>
                    Full refund of balance (minus deposit) if cancelled 14+ days
                    before session
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p>No refund within 14 days of session start</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-stone-900/50 rounded-xl border border-stone-800 p-6"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle
                    size={20}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-stone-400">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get <span className="text-red-500">Started?</span>
          </h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            Spots fill quickly. Secure your camper&apos;s place today with a $100
            deposit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/summer-camp/register"
              className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Register Now
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/eal/contact"
              className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors"
            >
              Questions? Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
