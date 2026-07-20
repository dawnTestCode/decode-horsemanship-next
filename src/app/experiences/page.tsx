'use client';

import Link from 'next/link';
import { ArrowRight, Users, Heart, Compass, Building2, HelpCircle, Sparkles } from 'lucide-react';
import { useProgramImages } from '@/hooks/useProgramImages';

const programs = [
  {
    slug: 'copper-and-lace',
    title: 'Copper & Lace',
    tagline: 'A full day for women',
    description: 'Horses, thread, fire. No riding required. You\'ll show up soft-handed and go home with calluses under the polish and a braid only you could make.',
    href: '/copper-and-lace',
    icon: Sparkles,
    color: 'copper',
    schedule: 'Second Saturday of each month',
    isNew: true,
  },
  {
    slug: 'no-reins',
    title: 'No Reins',
    tagline: 'A half-day retreat for women',
    description: 'No riding. No agenda. Just you and a horse who can\'t be fooled. A morning to stop being fine.',
    href: '/no-reins',
    icon: Heart,
    color: 'amber',
    schedule: 'Third Saturday of each month',
  },
  {
    slug: 'dust-and-leather',
    title: 'Dust & Leather',
    tagline: 'A working ranch day for men',
    description: 'Real ranch work alongside the horses. No agenda, no exercises—just a day doing honest work.',
    href: '/dust-and-leather',
    icon: Users,
    color: 'amber',
    schedule: 'First Saturday of each month',
  },
  {
    slug: 'groundwork',
    title: 'Groundwork',
    tagline: 'A half-day for men',
    description: 'Four hours. A horse that doesn\'t care about your job title. No talking circle. No trust falls.',
    href: '/groundwork',
    icon: Compass,
    color: 'stone',
    schedule: 'Second Saturday of each month',
  },
  {
    slug: 'corporate',
    title: 'Corporate Programs',
    tagline: 'Team development with horses',
    description: 'Leadership workshops, team building, and organizational development. Horses respond to the real you—not your title.',
    href: '/corporate',
    icon: Building2,
    color: 'blue',
    schedule: 'By arrangement',
  },
  {
    slug: 'mustang',
    title: 'Mustang Immersion',
    tagline: 'Three days with a wild horse',
    description: 'Work directly with a BLM mustang learning to trust humans. Witness transformation—theirs and yours.',
    href: '/mustang',
    icon: HelpCircle,
    color: 'red',
    schedule: 'Limited availability',
  },
];

export default function ExperiencesPage() {
  const { getImageUrl, getImageStyle } = useProgramImages();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-red-500">Experiences</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            Horses respond to who you really are, not who you're trying to be.
            Every program here uses that truth as the foundation.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => {
              const Icon = program.icon;
              const isNew = 'isNew' in program && program.isNew;
              return (
                <Link
                  key={program.slug}
                  href={program.href}
                  className={`group relative p-8 rounded-xl border transition-all hover:bg-stone-900/70 ${
                    isNew
                      ? 'bg-gradient-to-br from-amber-950/40 to-stone-900/50 border-amber-700/50 hover:border-amber-600'
                      : 'bg-stone-900/50 border-stone-800 hover:border-red-700'
                  }`}
                >
                  {isNew && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-stone-950 rounded">
                      New
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isNew ? 'bg-amber-900/40' : 'bg-red-900/30'
                    }`}>
                      <Icon className={isNew ? 'text-amber-500' : 'text-red-500'} size={24} />
                    </div>
                    {!isNew && (
                      <ArrowRight
                        size={20}
                        className="text-stone-600 group-hover:text-red-500 transition-colors mt-2"
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-stone-100 mb-1">
                    {program.title}
                  </h3>
                  <p className={`text-sm mb-3 italic ${isNew ? 'text-amber-500' : 'text-red-500'}`}>
                    {program.tagline}
                  </p>
                  <p className="text-stone-400 text-sm mb-4">
                    {program.description}
                  </p>
                  <p className="text-xs text-stone-500 uppercase tracking-wide">
                    {program.schedule}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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

      {/* Why Decode */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why <span className="text-red-500">Decode</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
              <h3 className="text-lg font-semibold text-stone-100 mb-2">
                Corporate + Equine Expertise
              </h3>
              <p className="text-stone-400">
                Our founder brings 25+ years of corporate leadership experience
                across Tech, Healthcare, and Finance.
              </p>
            </div>
            <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
              <h3 className="text-lg font-semibold text-stone-100 mb-2">
                Rescue Philosophy
              </h3>
              <p className="text-stone-400">
                Every horse in our program has a story of transformation—they
                understand change at the deepest level.
              </p>
            </div>
            <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
              <h3 className="text-lg font-semibold text-stone-100 mb-2">
                Tailored Experiences
              </h3>
              <p className="text-stone-400">
                We design each program around your specific goals, whether
                personal growth or team development.
              </p>
            </div>
            <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
              <h3 className="text-lg font-semibold text-stone-100 mb-2">
                Intimate Setting
              </h3>
              <p className="text-stone-400">
                Small groups ensure personalized attention and deeper engagement
                with the horses and facilitators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            Whether you're exploring for yourself or your organization, we'd
            love to discuss which program might be right for you.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Get in Touch
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
