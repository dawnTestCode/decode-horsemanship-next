'use client';

import Link from 'next/link';
import { Clock, Users, Target, ArrowRight, CheckCircle, Calendar } from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';

export default function CorporatePage() {
  const { getProgram, loading } = usePrograms([
    'corporate-half-day',
    'corporate-full-day',
    'corporate-series',
  ]);

  const halfDay = getProgram('corporate-half-day');
  const fullDay = getProgram('corporate-full-day');
  const series = getProgram('corporate-series');

  const programs = [
    {
      slug: 'corporate-half-day',
      title: 'Half-Day Experience',
      duration: halfDay?.duration || '4 hours',
      participants: `Up to ${halfDay?.max_capacity || 12} participants`,
      description: 'An introduction to equine-assisted learning, perfect for team outings or a first taste of EAL.',
      includes: [
        'Welcome and orientation',
        'Introduction to horse communication',
        '2-3 facilitated ground exercises',
        'Group debrief and integration',
        'Light refreshments'
      ],
      ideal: 'Teams seeking a unique bonding experience or organizations exploring EAL for the first time.'
    },
    {
      slug: 'corporate-full-day',
      title: 'Full-Day Intensive',
      duration: fullDay?.duration || '6-8 hours',
      participants: `Up to ${fullDay?.max_capacity || 12} participants`,
      description: 'A deeper dive into team dynamics, leadership, and communication through extended engagement with our horses.',
      includes: [
        'Everything in Half-Day, plus:',
        '4-5 facilitated exercises',
        'Individual and team challenges',
        'Extended reflection time',
        'Catered lunch',
        'Action planning session'
      ],
      ideal: 'Teams ready for meaningful development work or organizations addressing specific challenges.'
    },
    {
      slug: 'corporate-series',
      title: 'Leadership Series',
      duration: series?.duration || '3-6 sessions',
      participants: `Up to ${series?.max_capacity || 8} participants`,
      description: 'An ongoing program for leadership teams seeking sustained growth and transformation.',
      includes: [
        'Initial assessment and goal setting',
        'Monthly half-day sessions',
        'Progressive skill development',
        'Individual coaching elements',
        'Between-session integration support',
        'Final celebration and assessment'
      ],
      ideal: 'Executive teams, high-potential leaders, or groups committed to lasting change.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Corporate <span className="text-red-500">Programs</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            Transform your team through experiential learning with horses
          </p>
        </div>
      </section>

      {/* Why Corporate EAL */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Horses for <span className="text-red-500">Team Development</span>?
            </h2>
          </div>

          <div className="bg-stone-900/50 p-8 md:p-12 rounded-2xl border border-stone-800 mb-12">
            <p className="text-lg text-stone-300 mb-6">
              Traditional team-building often relies on artificial scenarios. Horses create
              real consequences and real feedback—moment by moment. Your team can&apos;t fake their
              way through it.
            </p>
            <p className="text-stone-400">
              Whether it&apos;s communication breakdown, trust issues, or leadership gaps, horses
              make the invisible visible. And in a safe, facilitated environment, teams can
              address what&apos;s really going on—not just what&apos;s comfortable to discuss.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Leadership</h3>
              <p className="text-stone-400">
                Discover authentic leadership presence that inspires without force
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Team Dynamics</h3>
              <p className="text-stone-400">
                Surface and address the real patterns affecting your team
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Lasting Impact</h3>
              <p className="text-stone-400">
                Experiential learning creates memories that drive real behavior change
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Program <span className="text-red-500">Options</span>
            </h2>
            <p className="text-stone-400">Choose the format that fits your team&apos;s needs</p>
          </div>

          <div className="space-y-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-stone-900/80 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-stone-100">{program.title}</h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-stone-800 rounded-full text-sm text-stone-300 flex items-center gap-2">
                        <Clock size={14} />
                        {program.duration}
                      </span>
                      <span className="px-3 py-1 bg-stone-800 rounded-full text-sm text-stone-300 flex items-center gap-2">
                        <Users size={14} />
                        {program.participants}
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-400 mb-6">{program.description}</p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-stone-200 mb-3">Includes:</h4>
                      <ul className="space-y-2">
                        {program.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-stone-400 text-sm">
                            <CheckCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-200 mb-3">Ideal For:</h4>
                      <p className="text-stone-400 text-sm">{program.ideal}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="mt-12 bg-gradient-to-r from-red-900/20 to-stone-900/50 p-8 rounded-2xl border border-red-900/30 text-center">
            <h3 className="text-xl font-bold text-stone-100 mb-4">Custom Pricing</h3>
            <p className="text-stone-400 mb-6">
              Every organization is different. We&apos;ll work with you to design a program
              that meets your goals and budget. Request a conversation to discuss your needs.
            </p>
            <Link
              href="/eal/contact"
              className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Request a Quote
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What to <span className="text-red-500">Expect</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-100 mb-2">Before Your Visit</h3>
                <p className="text-stone-400 text-sm">
                  We&apos;ll have a discovery call to understand your goals and any specific challenges
                  you want to address. This helps us tailor the experience to your team.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-100 mb-2">During the Experience</h3>
                <p className="text-stone-400 text-sm">
                  No horse experience needed! All activities are on the ground. Our facilitators
                  guide you through exercises designed to surface insights relevant to your work.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-100 mb-2">After You Leave</h3>
                <p className="text-stone-400 text-sm">
                  You&apos;ll receive a summary of key themes and suggested action items. For Series
                  programs, we provide ongoing support between sessions.
                </p>
              </div>
            </div>
            <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
              <h3 className="text-lg font-semibold text-stone-100 mb-4">Practical Details</h3>
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Wear closed-toe shoes and weather-appropriate clothing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  All activities take place outdoors or in our covered arena
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  We accommodate dietary restrictions for catered meals
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Restroom facilities available on-site
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Located in Chapel Hill, NC—easy access from the Triangle
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Team?</h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how equine-assisted learning can address your specific
            organizational goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eal/contact"
              className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Book a Discovery Call
            </Link>
            <Link
              href="/eal/about"
              className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors"
            >
              Learn About Our Approach
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
