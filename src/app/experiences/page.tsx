'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useProgramImages } from '@/hooks/useProgramImages';
import { getPublishedExperiences } from '@/config/experiences';
import ExperienceGrid from '@/components/home/ExperienceGrid';
import FeaturedEvent from '@/components/home/FeaturedEvent';
import WhyDecode from '@/components/home/WhyDecode';

const expectations = [
  {
    title: 'On the ground',
    body: 'Most of the work happens on the ground, beside the horse. No riding required.',
  },
  {
    title: 'Small groups',
    body: 'Small by design, so there is room to notice what is actually happening.',
  },
  {
    title: 'No horse experience needed',
    body: 'You do not need the right horse words. Come curious, unsure, or out of practice.',
  },
];

export default function ExperiencesPage() {
  const { getImageUrl, getImageStyle } = useProgramImages();
  const cards = getPublishedExperiences({ page: 'experiences' });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-red-500 mb-4">
            Horse-led workshops in Chapel Hill, North Carolina
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Horses don&rsquo;t care what your title is.
          </h1>
          <p className="text-xl text-stone-400 mb-6 max-w-2xl mx-auto">
            They notice clarity, pressure, hesitation, and intent. Decode Horsemanship creates hands-on
            experiences for people meeting horses for the first time, leaders building better teams,
            organizations moving through change, and horse people ready to see something new.
          </p>
          <p className="text-sm text-stone-500">
            No horse experience required. Most experiences happen on the ground.
          </p>
        </div>
      </section>

      {/* Upcoming dates - renders only while an event is current */}
      <FeaturedEvent />

      {/* Personal experiences */}
      <section id="personal-experiences" className="py-16 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">Workshops and experiences</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Come for a day. Leave with something real.</h2>
            <p className="text-lg text-stone-400">
              These are not riding lessons dressed up as retreats. They are small, hands-on experiences built
              around honest attention, useful work, and what a horse notices before people say a word.
            </p>
          </div>
          <ExperienceGrid cards={cards} />
        </div>
      </section>

      {/* Leadership and organizational experiences */}
      <section id="organizations" className="py-16 px-4 bg-stone-900/30 scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">For teams and organizations</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            When the pattern is hard to name, let the horse make it visible.
          </h2>
          <p className="text-lg text-stone-400 mb-8">
            Leadership gaps, mixed signals, stalled trust, and change fatigue do not disappear because a team has
            discussed them. A ground-based experience with horses gives the group something real to respond
            to—then a skilled facilitator helps turn what happened into useful language and next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/corporate#inquiry"
              className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Plan a team experience
            </Link>
            <Link
              href="/corporate"
              className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors"
            >
              See how the work happens
            </Link>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">What to expect</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {expectations.map((item) => (
              <div key={item.title} className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
                <h3 className="text-lg font-semibold text-stone-100 mb-2">{item.title}</h3>
                <p className="text-stone-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dawn and herd credibility */}
      <WhyDecode />

      {/* The Mustang Story */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Meet <span className="text-red-500">Glitch & Dub</span>
            </h2>
            <p className="text-stone-400">
              The mustangs at the heart of our work
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-stone-900/50 rounded-2xl overflow-hidden border border-stone-800">
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
                <h3 className="text-xl font-bold text-stone-100 mb-2">
                  Glitch
                </h3>
                <p className="text-stone-400">
                  A BLM mustang mare from the Spruce-Pequop HMA in Nevada,
                  Glitch came to us with some ground handling already behind her
                  — but the deeper work of building genuine trust has unfolded
                  here, one session at a time.
                </p>
              </div>
            </div>
            <div className="bg-stone-900/50 rounded-2xl overflow-hidden border border-stone-800">
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
                <h3 className="text-xl font-bold text-stone-100 mb-2">Dub</h3>
                <p className="text-stone-400">
                  A three-year-old BLM mustang mare from the Conant Creek HMA in
                  Wyoming, Dub arrives at Decode in June 2026. She is at the
                  very beginning of her journey with humans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">You do not have to know which program you need.</h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            Tell us who is coming, what is changing, or what keeps pulling you toward horses. We&rsquo;ll tell you
            the clearest place to start.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Start the conversation
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
