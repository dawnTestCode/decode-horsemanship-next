'use client';

import Link from 'next/link';
import { GraduationCap, Heart, Users, ArrowRight, Calendar, Clock, CheckCircle, Star, DollarSign } from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';

export default function YouthPage() {
  const { loading, getProgram, formatPrice, formatDate, formatTime, getSpotsRemaining } = usePrograms([
    'youth-semester',
    'youth-intensive',
  ]);

  const youthSemester = getProgram('youth-semester');
  const youthIntensive = getProgram('youth-intensive');

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Youth <span className="text-red-500">Programs</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            Helping young people develop confidence, emotional intelligence,
            and leadership skills through meaningful connection with horses
          </p>
        </div>
      </section>

      {/* Why Youth EAL */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-900/50 p-8 md:p-12 rounded-2xl border border-stone-800 mb-16">
            <h2 className="text-2xl font-bold mb-6">
              Why Horses for <span className="text-red-500">Young People</span>?
            </h2>
            <p className="text-lg text-stone-300 mb-6">
              Young people today face pressures previous generations couldn&apos;t imagine.
              Social media, academic stress, and an uncertain future create anxiety
              and disconnection. Horses offer something different.
            </p>
            <p className="text-stone-400 mb-6">
              With a horse, there&apos;s no performance to maintain. No likes to count.
              Just honest, moment-to-moment relationship building. Horses respond
              to how you show up—not your grades, your followers, or your status.
            </p>
            <p className="text-stone-400">
              For many young people, this is the first time they&apos;ve experienced
              feedback without judgment—and connection without expectation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Emotional Awareness</h3>
              <p className="text-stone-400 text-sm">
                Horses mirror our emotional state, helping young people recognize
                and regulate their feelings
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Social Skills</h3>
              <p className="text-stone-400 text-sm">
                Non-verbal communication with horses translates to better
                understanding of human relationships
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Confidence</h3>
              <p className="text-stone-400 text-sm">
                Successfully working with a 1,000-pound animal builds
                genuine self-efficacy and courage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Our <span className="text-red-500">Programs</span>
            </h2>
          </div>

          {/* Semester Program */}
          <div className="bg-stone-900/80 rounded-2xl border border-stone-800 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-red-900/30 to-transparent p-6 border-b border-stone-800">
              <div className="flex flex-wrap items-center gap-4">
                <GraduationCap className="text-red-500" size={28} />
                <h3 className="text-2xl font-bold text-stone-100">Semester Program</h3>
                <span className="px-3 py-1 bg-red-700 rounded-full text-sm text-white">
                  Most Popular
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-2 text-stone-400">
                      <Calendar size={14} />
                      12 weeks
                    </span>
                    <span className="flex items-center gap-2 text-stone-400">
                      <Clock size={14} />
                      Weekly 2-hour sessions
                    </span>
                  </div>
                  <p className="text-stone-400 mb-6">
                    Our signature program for youth ages {youthSemester?.min_age || 12}-{youthSemester?.max_age || 18}. Weekly sessions build
                    progressively, developing skills in horsemanship while addressing
                    themes like confidence, boundaries, communication, and leadership.
                  </p>
                  <h4 className="font-semibold text-stone-200 mb-3">Curriculum Includes:</h4>
                  <ul className="space-y-2">
                    {[
                      'Horse behavior and communication',
                      'Groundwork fundamentals',
                      'Emotional regulation exercises',
                      'Leadership challenges',
                      'Team collaboration activities',
                      'Personal reflection and journaling'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-400 text-sm">
                        <CheckCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="bg-stone-800/50 p-6 rounded-xl mb-6">
                    <h4 className="font-semibold text-stone-200 mb-3">Upcoming Cohorts:</h4>

                    {youthSemester?.full_price && (
                      <div className="flex items-center gap-2 text-stone-300 mb-4">
                        <DollarSign size={18} className="text-red-500" />
                        <span className="text-lg font-bold text-red-500">
                          {youthSemester.deposit_only && youthSemester.deposit_amount
                            ? `${formatPrice(youthSemester.deposit_amount)} deposit`
                            : formatPrice(youthSemester.full_price)}
                        </span>
                        {youthSemester.deposit_only && youthSemester.deposit_amount && (
                          <span className="text-stone-400 text-sm">
                            ({formatPrice(youthSemester.full_price)} total)
                          </span>
                        )}
                      </div>
                    )}

                    {!loading && youthSemester?.dates && youthSemester.dates.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {youthSemester.dates.map((date) => {
                          const spotsRemaining = getSpotsRemaining(date, youthSemester);
                          const isFull = spotsRemaining <= 0;
                          return (
                            <div
                              key={date.id}
                              className="bg-stone-900/50 p-3 rounded-lg border border-stone-700"
                            >
                              <div className="font-medium text-stone-200">{formatDate(date.start_date)}</div>
                              <div className={`text-sm ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                                {isFull ? 'Sold Out' : `${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} remaining`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-stone-500 text-sm italic mb-4">
                        Contact us for current enrollment dates and availability
                      </p>
                    )}

                    <Link
                      href="/eal/contact"
                      className="w-full px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                    >
                      Inquire About Enrollment
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <p className="text-stone-500 text-sm">
                    Limited to {youthSemester?.max_capacity || 6} participants per cohort to ensure personalized attention.
                    Parent/guardian orientation session included.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Youth Intensive */}
          <div className="bg-stone-900/80 rounded-2xl border border-stone-800 overflow-hidden">
            <div className="p-6 border-b border-stone-800">
              <div className="flex flex-wrap items-center gap-4">
                <Star className="text-red-500" size={28} />
                <h3 className="text-2xl font-bold text-stone-100">Youth Intensive</h3>
              </div>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-2 text-stone-400">
                      <Calendar size={14} />
                      Single day or weekend
                    </span>
                    <span className="flex items-center gap-2 text-stone-400">
                      <Clock size={14} />
                      6-8 hours
                    </span>
                  </div>
                  <p className="text-stone-400 mb-6">
                    A concentrated experience for youth who can&apos;t commit to a full
                    semester, or who want to try EAL before enrolling in the longer
                    program. Great for individuals or small groups.
                  </p>
                  <h4 className="font-semibold text-stone-200 mb-3">Perfect For:</h4>
                  <ul className="space-y-2 text-stone-400 text-sm">
                    <li>• Out-of-town participants</li>
                    <li>• Birthday or milestone celebrations</li>
                    <li>• Small friend groups seeking connection</li>
                    <li>• Youth navigating specific challenges</li>
                  </ul>
                </div>
                <div className="bg-stone-800/50 p-6 rounded-xl">
                  <h4 className="font-semibold text-stone-200 mb-3">Availability:</h4>

                  {youthIntensive?.full_price && (
                    <div className="flex items-center gap-2 text-stone-300 mb-4">
                      <DollarSign size={18} className="text-red-500" />
                      <span className="text-lg font-bold text-red-500">
                        {formatPrice(youthIntensive.full_price)}
                      </span>
                    </div>
                  )}

                  <p className="text-stone-500 text-sm mb-4">
                    Scheduled by appointment. Weekends and school holidays preferred.
                  </p>

                  <Link
                    href="/eal/contact"
                    className="w-full px-6 py-3 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Schedule an Intensive
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              For <span className="text-red-500">Parents</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
              <h3 className="text-xl font-bold text-stone-100 mb-4">What to Expect</h3>
              <ul className="space-y-3 text-stone-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Parent orientation before the program begins
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Regular progress updates (with youth&apos;s permission)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  End-of-program sharing session
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Resources for supporting growth at home
                </li>
              </ul>
            </div>
            <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
              <h3 className="text-xl font-bold text-stone-100 mb-4">Safety & Supervision</h3>
              <ul className="space-y-3 text-stone-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  All activities are ground-based (no riding)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Low participant-to-facilitator ratio
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Our horses are carefully selected for temperament
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Safety protocols reviewed at every session
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/20 to-stone-900/50 p-8 md:p-12 rounded-2xl border border-red-900/30 text-center">
            <blockquote className="text-xl text-stone-300 italic mb-6">
              &quot;My daughter came home from each session calmer and more confident.
              The horses taught her things I couldn&apos;t.&quot;
            </blockquote>
            <p className="text-stone-500">— Parent of Semester Program Participant</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enroll?</h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            Space is limited in all our youth programs. Contact us to discuss
            which option is right for your young person.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eal/contact"
              className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Contact Us to Enroll
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/eal"
              className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors"
            >
              Learn More About EAL
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
