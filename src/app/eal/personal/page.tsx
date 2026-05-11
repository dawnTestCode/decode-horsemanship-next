'use client';

import Link from 'next/link';
import { Heart, Sparkles, Sun, Moon, ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import { useEALImages } from '@/hooks/useEALImages';
import { usePrograms } from '@/hooks/usePrograms';

export default function PersonalPage() {
  const { getImageUrl, getImageStyle } = useEALImages();
  const { loading, getProgram, formatPrice, formatDate, formatTime, getSpotsRemaining } = usePrograms([
    'womens-retreat',
    'personal-intensive',
  ]);

  const womensRetreat = getProgram('womens-retreat');
  const personalIntensive = getProgram('personal-intensive');

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Personal <span className="text-red-500">Development</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            Deepen your self-awareness, reconnect with your authentic voice, and
            discover new possibilities through partnership with horses
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-900/50 p-8 md:p-12 rounded-2xl border border-stone-800 mb-16">
            <p className="text-lg text-stone-300 mb-6">
              Sometimes we need space—away from our daily routines, roles, and expectations—to
              remember who we really are. Horses create that space naturally.
            </p>
            <p className="text-stone-400">
              In the arena with a horse, titles and personas fall away. What remains is your
              authentic presence: your energy, your emotions, your way of being. Horses respond
              to this truth, offering feedback that is immediate, honest, and often surprisingly
              gentle.
            </p>
          </div>
        </div>
      </section>

      {/* Women's Retreats */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 rounded-full text-red-400 text-sm mb-4">
                <Sun size={16} />
                {womensRetreat?.dates && womensRetreat.dates.length > 0 ? 'Upcoming Dates' : 'Coming Soon'}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                What the Horse <span className="text-red-500">Knows</span>
              </h2>
              <p className="text-stone-500 text-sm italic mb-6">
                A Retreat for Women at Decode Horsemanship
              </p>
              <p className="text-stone-400 mb-6">
                The people in your life hear your words. Horses feel your truth.
                A half-day retreat where women explore self-awareness, presence, and
                boundaries — guided by horses who only respond to who you actually are.
                No performance. No pretending. Just you.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-stone-300">
                  <Calendar size={18} className="text-red-500" />
                  <span>Half-day experience (approx. 4 hours)</span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <Users size={18} className="text-red-500" />
                  <span>4 to {womensRetreat?.max_capacity || 8} participants — intimate by design</span>
                </div>
                <div className="flex items-center gap-3 text-stone-300">
                  <Heart size={18} className="text-red-500" />
                  <span>{womensRetreat?.price_label || '$225'} per participant</span>
                </div>
              </div>

              {/* Upcoming Dates */}
              {!loading && womensRetreat?.dates && womensRetreat.dates.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-stone-200 mb-3">Upcoming Dates:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {womensRetreat.dates.map((date) => {
                      const spotsRemaining = getSpotsRemaining(date, womensRetreat);
                      const isFull = spotsRemaining <= 0;
                      return (
                        <div
                          key={date.id}
                          className="bg-stone-800/50 p-4 rounded-lg border border-stone-700 flex flex-col gap-2"
                        >
                          <div className="font-medium text-stone-200">{formatDate(date.start_date)}</div>
                          {date.start_time && (
                            <div className="text-sm text-stone-400 flex items-center gap-1">
                              <Clock size={14} />
                              {formatTime(date.start_time)} - {formatTime(date.end_time)}
                            </div>
                          )}
                          <div className={`text-sm ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                            {isFull ? 'Sold Out' : `${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} remaining`}
                          </div>
                          {!isFull && (
                            <Link
                              href={`/eal/womens-retreat/register?date=${date.start_date}`}
                              className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm w-full text-center"
                            >
                              Reserve Your Spot
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(!womensRetreat?.dates || womensRetreat.dates.length === 0) && !loading && (
                <Link
                  href="/eal/womens-retreat/register"
                  className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  Join the Waitlist
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
            <div>
              <div className="aspect-[4/3] bg-stone-800 rounded-2xl overflow-hidden">
                {getImageUrl('retreat_photo') ? (
                  <img
                    src={getImageUrl('retreat_photo')!}
                    alt="Women's Retreat"
                    className="w-full h-full object-cover"
                    style={getImageStyle('retreat_photo')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600">
                    <span className="text-sm">Retreat Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Growth Intensive */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="order-2 md:order-1 aspect-[4/3] bg-stone-800 rounded-2xl overflow-hidden">
              {getImageUrl('intensive_photo') ? (
                <img
                  src={getImageUrl('intensive_photo')!}
                  alt="Personal Intensive"
                  className="w-full h-full object-cover"
                  style={getImageStyle('intensive_photo')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600">
                  <span className="text-sm">Intensive Photo</span>
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 rounded-full text-stone-400 text-sm mb-4">
                <Moon size={16} />
                By Appointment
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Personal Growth <span className="text-red-500">Intensives</span>
              </h2>
              <p className="text-stone-400 mb-6">
                A private, customized experience for individuals ready for deep work.
                Whether you&apos;re navigating a transition, processing a challenge, or simply
                seeking clarity, this intimate format allows for profound exploration.
              </p>
              <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 mb-6">
                <h4 className="font-semibold text-stone-200 mb-3">Common Themes:</h4>
                <ul className="space-y-2 text-stone-400 text-sm">
                  <li>• Life transitions and decision-making</li>
                  <li>• Rebuilding confidence after setbacks</li>
                  <li>• Exploring patterns in relationships</li>
                  <li>• Reconnecting with purpose and passion</li>
                  <li>• Processing grief or significant change</li>
                </ul>
              </div>

              <Link
                href="/eal/contact"
                className="px-6 py-3 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Schedule a Consultation
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What Makes This <span className="text-red-500">Different</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-stone-900/80 p-8 rounded-xl border border-stone-800 text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Embodied Learning</h3>
              <p className="text-stone-400 text-sm">
                This isn&apos;t talk therapy. It&apos;s experiential—you&apos;ll be in your body,
                with horses, discovering through doing.
              </p>
            </div>
            <div className="bg-stone-900/80 p-8 rounded-xl border border-stone-800 text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Immediate Truth</h3>
              <p className="text-stone-400 text-sm">
                Horses don&apos;t wait weeks to give you feedback. They respond to your
                authentic state in real-time.
              </p>
            </div>
            <div className="bg-stone-900/80 p-8 rounded-xl border border-stone-800 text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Nature&apos;s Rhythm</h3>
              <p className="text-stone-400 text-sm">
                Being outside, with animals, grounds us in a way that four walls
                never can. The setting itself is healing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/20 to-stone-900/50 p-8 md:p-12 rounded-2xl border border-red-900/30 text-center">
            <blockquote className="text-xl text-stone-300 italic mb-6">
              &quot;I came looking for answers and left with something better—the confidence
              to trust my own knowing.&quot;
            </blockquote>
            <p className="text-stone-500">— Retreat Participant</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re drawn to our group retreats or prefer a private intensive,
            we&apos;re here to support your next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eal/contact"
              className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Connect With Us
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
