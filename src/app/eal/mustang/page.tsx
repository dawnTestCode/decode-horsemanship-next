'use client';

import Link from 'next/link';
import { Wind, Heart, Eye, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useEALImages } from '@/hooks/useEALImages';
import { usePrograms } from '@/hooks/usePrograms';

export default function MustangPage() {
  const { getImageUrl, getImageStyle } = useEALImages();
  const { getProgram, formatPrice, loading } = usePrograms([
    'mustang-half-day',
    'mustang-full-day',
  ]);

  const halfDay = getProgram('mustang-half-day');
  const fullDay = getProgram('mustang-full-day');

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Mustang <span className="text-red-500">Immersion</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            A rare invitation to connect with wild horses on their terms—and
            discover what they can teach us about trust, patience, and presence
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/20 to-stone-900/50 p-8 md:p-12 rounded-2xl border border-red-900/30 mb-16">
            <h2 className="text-2xl font-bold mb-6">This is Different</h2>
            <p className="text-lg text-stone-300 mb-6">
              Our mustangs—Glitch and Dub—each came to us through the BLM
              adoption program, carrying the instincts and wariness of horses
              shaped by life on the range. Glitch, a mare from the Spruce-Pequop
              HMA in Nevada, arrived with some ground handling already behind
              her — but building a genuine partnership has been an entirely
              different kind of work. Dub, a three-year-old mare from the Conant
              Creek HMA in Wyoming, joins us in June 2026, at the very start of
              her journey with humans.
            </p>
            <p className="text-stone-400 mb-6">
              Working with them isn&apos;t about training or techniques. It&apos;s about
              earning something that can&apos;t be forced: trust from an animal that
              has every reason to be wary of humans.
            </p>
            <p className="text-stone-400">
              This experience is for those ready to slow down, set aside their
              usual ways of &quot;getting results,&quot; and learn what it means to simply
              be present with another being.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Mustangs */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Meet <span className="text-red-500">Glitch & Dub</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-900/80 rounded-2xl overflow-hidden border border-stone-800">
              <div className="aspect-[4/3] bg-stone-800">
                {getImageUrl("glitch") ? (
                  <img
                    src={getImageUrl("glitch")!}
                    alt="Glitch"
                    className="w-full h-full object-cover"
                    style={getImageStyle("glitch")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600">
                    <span className="text-sm">Glitch Photo</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-100 mb-3">
                  Glitch
                </h3>
                <p className="text-stone-400 text-sm mb-4">
                  Glitch teaches us about the power of patience. Every
                  meaningful step forward with her is earned — and that makes
                  each breakthrough significant in a way that&apos;s hard to
                  describe.
                </p>
                <p className="text-stone-500 text-sm italic">
                  &quot;Glitch showed me that trust isn&apos;t given or taken—it&apos;s built,
                  one moment at a time.&quot;
                </p>
              </div>
            </div>

            <div className="bg-stone-900/80 rounded-2xl overflow-hidden border border-stone-800">
              <div className="aspect-[4/3] bg-stone-800">
                {getImageUrl("dub") ? (
                  <img
                    src={getImageUrl("dub")!}
                    alt="Dub"
                    className="w-full h-full object-cover"
                    style={getImageStyle("dub")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600">
                    <span className="text-sm">Dub Photo</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-100 mb-3">Dub</h3>
                <p className="text-stone-400 text-sm mb-4">
                  Dub arrives in June 2026, at the very beginning of her
                  relationship with humans. She asks us to show up without
                  agenda, without force — just presence. As that trust develops,
                  every small step she offers will mean something.
                </p>
                <p className="text-stone-500 text-sm italic">
                  &quot;The most honest relationships are built from nothing. That&apos;s what Dub will teach.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Experience */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              The <span className="text-red-500">Experience</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Observe</h3>
              <p className="text-stone-400 text-sm">
                We begin by simply watching—learning to read the mustangs&apos; body
                language, understanding their world on their terms.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">
                Approach
              </h3>
              <p className="text-stone-400 text-sm">
                Guided exercises help you explore what it feels like to enter
                their space—slowly, respectfully, without expectation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">Connect</h3>
              <p className="text-stone-400 text-sm">
                When connection happens—a soft eye, a step toward you, a moment
                of mutual curiosity—it&apos;s unlike anything else.
              </p>
            </div>
          </div>

          <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
            <h3 className="text-xl font-bold text-stone-100 mb-4">
              What This Isn&apos;t
            </h3>
            <p className="text-stone-400 mb-4">
              This isn&apos;t a training clinic. You won&apos;t be &quot;gentling&quot; a wild horse
              in an afternoon. This is about being present with an animal that
              hasn&apos;t been shaped by human expectations—and seeing what that
              mirror reveals about you.
            </p>
            <p className="text-stone-400">
              If you&apos;re used to achieving, performing, or controlling outcomes,
              the mustangs will invite you to try something different. And that
              discomfort is where the learning lives.
            </p>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Choose Your <span className="text-red-500">Experience</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-900/80 p-8 rounded-xl border border-stone-800">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-red-500" size={24} />
                <h3 className="text-xl font-bold text-stone-100">
                  Half-Day Immersion
                </h3>
              </div>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-2 text-stone-400">
                  <Clock size={14} />
                  3-4 hours
                </span>
              </div>
              <p className="text-stone-400 mb-6">
                An introduction to mustang work. We&apos;ll spend time observing,
                learning about wild horse behavior, and doing gentle exercises
                in and around their space.
              </p>
              <p className="text-stone-500 text-sm mb-6">
                Perfect for those curious about the experience or looking for a
                meaningful few hours of reflection.
              </p>

              {/* Pricing */}
              {!loading && halfDay?.full_price ? (
                <div className="text-lg font-bold text-red-500 mb-4">
                  {formatPrice(halfDay.full_price)}
                </div>
              ) : (
                <div className="text-lg font-bold text-red-500 mb-4">
                  Contact for Pricing
                </div>
              )}

              <Link
                href="/eal/contact"
                className="w-full px-6 py-3 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                Inquire Now
              </Link>
            </div>

            <div className="bg-gradient-to-br from-red-900/20 to-stone-900/80 p-8 rounded-xl border border-red-900/50">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-red-500" size={24} />
                <h3 className="text-xl font-bold text-stone-100">
                  Full-Day Deep Dive
                </h3>
              </div>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-2 text-stone-400">
                  <Clock size={14} />
                  6-7 hours
                </span>
              </div>
              <p className="text-stone-400 mb-6">
                A full day with the mustangs, including extended time for deeper
                exercises, reflection, and the possibility of more meaningful
                breakthroughs.
              </p>
              <p className="text-stone-500 text-sm mb-6">
                Includes lunch. Recommended for those seeking a more immersive
                and transformative experience.
              </p>

              {/* Pricing */}
              {!loading && fullDay?.full_price ? (
                <div className="text-lg font-bold text-red-500 mb-4">
                  {formatPrice(fullDay.full_price)}
                </div>
              ) : (
                <div className="text-lg font-bold text-red-500 mb-4">
                  Contact for Pricing
                </div>
              )}

              <Link
                href="/eal/contact"
                className="w-full px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                Schedule Your Day
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <p className="text-center text-stone-500 text-sm mt-8">
            Private experiences only. Limited availability to protect the
            mustangs&apos; well-being.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Meet the Wild?</h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            This experience isn&apos;t for everyone—and that&apos;s by design. If
            something in you is drawn to this work, let&apos;s talk.
          </p>
          <Link
            href="/eal/contact"
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Start the Conversation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
