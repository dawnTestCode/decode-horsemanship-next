'use client';

import Link from 'next/link';
import { Heart, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useEALImages } from '@/hooks/useEALImages';

export default function EALOverviewPage() {
  const { getImageUrl, getImageStyle } = useEALImages();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Equine Assisted <span className="text-red-500">Learning</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            Transformative experiences that use horses as partners in personal
            and professional development
          </p>
        </div>
      </section>

      {/* What is EAL */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What is <span className="text-red-500">EAL</span>?
            </h2>
          </div>

          <div className="bg-stone-900/50 p-8 md:p-12 rounded-2xl border border-stone-800 mb-12">
            <p className="text-lg text-stone-300 mb-6">
              Equine Assisted Learning (EAL) is an experiential approach to
              personal and professional development that partners humans with
              horses in ground-based activities. No riding experience is
              required—all exercises happen on the ground.
            </p>
            <p className="text-stone-400 mb-6">
              Horses are uniquely suited to this work because they are prey
              animals with highly developed non-verbal communication skills.
              They respond to our authentic emotional state, not our words or
              intentions. This creates powerful opportunities for self-discovery
              and growth.
            </p>
            <p className="text-stone-400">
              Through carefully designed activities, participants gain insights
              into their communication patterns, leadership style, emotional
              awareness, and relationship dynamics—all in a safe, supportive
              environment.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">
                Authentic Connection
              </h3>
              <p className="text-stone-400">
                Horses respond to who you really are, creating space for genuine
                self-discovery
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">
                Immediate Feedback
              </h3>
              <p className="text-stone-400">
                Real-time responses from horses create powerful learning moments
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">
                Transferable Skills
              </h3>
              <p className="text-stone-400">
                Insights and breakthroughs translate directly to work and life
              </p>
            </div>
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
              The mustangs at the heart of our EAL program
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

          <div className="space-y-6 mb-12">
            {[
              {
                title: "Corporate + Equine Expertise",
                description:
                  "Our founder brings 25+ years of corporate leadership experience across Tech, Healthcare, and Finance.",
              },
              {
                title: "Rescue Philosophy",
                description:
                  "Every horse in our program has a story of transformation—they understand change at the deepest level.",
              },
              {
                title: "Tailored Experiences",
                description:
                  "We design each program around your specific goals, whether personal growth or team development.",
              },
              {
                title: "Intimate Setting",
                description:
                  "Small groups ensure personalized attention and deeper engagement with the horses and facilitators.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-stone-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Our <span className="text-red-500">Programs</span>
            </h2>
            <p className="text-stone-400">
              Find the experience that&apos;s right for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/eal/corporate"
              className="group bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors"
            >
              <h3 className="text-xl font-bold text-stone-100 mb-3 flex items-center justify-between">
                Corporate Programs
                <ArrowRight
                  size={20}
                  className="text-stone-600 group-hover:text-red-500 transition-colors"
                />
              </h3>
              <p className="text-stone-400">
                Team building, leadership development, and organizational change
                experiences designed for workplace impact.
              </p>
            </Link>

            <Link
              href="/eal/no-reins"
              className="group bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors"
            >
              <h3 className="text-xl font-bold text-stone-100 mb-3 flex items-center justify-between">
                No Reins
                <ArrowRight
                  size={20}
                  className="text-stone-600 group-hover:text-red-500 transition-colors"
                />
              </h3>
              <p className="text-stone-400">
                A half-day retreat for women. No riding. No agenda. Just you and
                a horse who can&apos;t be fooled.
              </p>
            </Link>

            <Link
              href="/eal/mustang"
              className="group bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors"
            >
              <h3 className="text-xl font-bold text-stone-100 mb-3 flex items-center justify-between">
                Mustang Immersion
                <ArrowRight
                  size={20}
                  className="text-stone-600 group-hover:text-red-500 transition-colors"
                />
              </h3>
              <p className="text-stone-400">
                A unique experience working directly with wild mustangs on their
                journey to trust.
              </p>
            </Link>

            <Link
              href="/eal/youth"
              className="group bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors"
            >
              <h3 className="text-xl font-bold text-stone-100 mb-3 flex items-center justify-between">
                Youth Programs
                <ArrowRight
                  size={20}
                  className="text-stone-600 group-hover:text-red-500 transition-colors"
                />
              </h3>
              <p className="text-stone-400">
                Semester programs and intensives helping young people develop
                confidence, empathy, and leadership.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re exploring for yourself or your organization, we&apos;d
            love to discuss how EAL can support your goals.
          </p>
          <Link
            href="/eal/contact"
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Schedule a Conversation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
