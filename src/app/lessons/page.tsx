'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function LessonsPage() {
  return (
    <div className="bg-[#0C0A09]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4" style={{ background: 'linear-gradient(180deg, #0C0A09 0%, #1A0B0E 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#f5f0e8] leading-tight mb-8 tracking-tight">
            Not all horse girls start as little girls.
          </h1>
          <div className="w-16 h-0.5 bg-[#9E1B32] mx-auto mb-8" />
          <div className="text-lg md:text-xl text-stone-400 max-w-3xl mx-auto space-y-4">
            <p>
              Some people have wanted this their whole life and never said it out loud. Some just brought a horse home last month and have no idea what they&apos;re doing. Some don&apos;t even know if they want to <em>ride</em> — they just know they want to be around horses, and learn what that could look like.
            </p>
            <p className="text-stone-300 font-medium">
              All of you are in the right place.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">

        {/* Two Ways In */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-10">TWO WAYS IN</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Door 1 - Never had one */}
            <Link
              href="/lessons/new-to-horses"
              className="group relative block p-8 bg-stone-900/30 rounded-xl border-2 border-[#9E1B32]/30 hover:border-[#9E1B32] transition-all duration-300"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#9E1B32] uppercase mb-4 block">
                Door One
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-[#f5f0e8] mb-4 leading-snug">
                Never had one, but you think about it more than you say out loud?
              </h3>
              <p className="text-stone-400 mb-8 leading-relaxed">
                You don&apos;t have to already own a horse — or even know if you want to ride — to start. Maybe you think you&apos;re too old, or you&apos;re nervous, or you just don&apos;t know where to begin.
              </p>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9E1B32] hover:bg-[#7a1527] text-white font-medium rounded-lg transition-colors">
                Decode the Desire
                <ArrowRight size={18} />
              </span>
            </Link>

            {/* Door 2 - Already have a horse */}
            <Link
              href="/lessons/decode-the-noise"
              className="group relative block p-8 bg-stone-900/30 rounded-xl border-2 border-[#9E1B32]/30 hover:border-[#9E1B32] transition-all duration-300"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#9E1B32] uppercase mb-4 block">
                Door Two
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-[#f5f0e8] mb-4 leading-snug">
                Already have a horse?
              </h3>
              <p className="text-stone-400 mb-8 leading-relaxed">
                Between the internet, the barn aisle, and three conflicting trainers, you don&apos;t need one more opinion. You need someone to decode the noise.
              </p>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9E1B32] hover:bg-[#7a1527] text-white font-medium rounded-lg transition-colors">
                Decode the Noise
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>

          {/* Farm Tour Option */}
          <div className="text-center p-8 bg-stone-900/20 rounded-xl border border-stone-800">
            <p className="text-stone-300 mb-4">
              <strong className="text-stone-200">Not ready for either?</strong> Come see the farm.
            </p>
            <p className="text-stone-400 mb-4">
              No commitment, no pressure. A 30-minute walk-through of the property and horses, and a conversation about what you&apos;d actually want to do here.
            </p>
            <p className="text-stone-400 mb-6">
              Got a kid? See <Link href="/kids-lessons" className="text-[#9E1B32] hover:text-[#b82e45] transition-colors">Kids & Family Lessons</Link>
            </p>
            <Link
              href="/lessons/book"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#9E1B32] hover:bg-[#7a1527] text-white font-medium rounded-lg transition-colors"
            >
              Book a Farm Tour
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* What It Is */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHAT IT IS</h2>
          <div className="text-lg text-stone-300 max-w-3xl space-y-4">
            <p>
              Private, one-on-one lessons in natural horsemanship. Not a one-day event. Not a retreat. Ongoing instruction, roughly an hour at a time, built around wherever you actually are — on the ground, in the saddle, or figuring out which one comes first.
            </p>
            <p>
              <strong className="text-stone-200">You do not have to already ride to start.</strong> A lot of what we do happens before anyone gets on a horse — building trust, reading body language, learning to lead and handle safely. If and when riding becomes part of it, that&apos;s a conversation we have together, at your pace.
            </p>
          </div>
        </section>

        {/* Meet The Horses */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">MEET THE HORSES</h2>
          <p className="text-lg text-stone-300 mb-8">
            You&apos;re not just choosing an instructor — you&apos;re meeting a horse. Here are just 2 of our herd.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/horses/willow.jpeg"
                  alt="Willow, a black and white horse, being gently petted by a child"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-[#f5f0e8] mb-2">Willow</h3>
                <p className="text-stone-400">
                  Patient and intuitive. She reads nervous energy and responds with calm. Perfect for first-timers who need a horse that won&apos;t rush them.
                </p>
              </div>
            </div>

            <div className="bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/horses/ethan.jpeg"
                  alt="Ethan, a steady and forgiving horse"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-[#f5f0e8] mb-2">Ethan</h3>
                <p className="text-stone-400">
                  Steady and forgiving. He was born quiet and doesn&apos;t spook easy. Great for building confidence on the ground or in the saddle.
                </p>
              </div>
            </div>
          </div>

          <p className="text-stone-500 italic text-center">
            Every beginner is matched with a horse suited to exactly where they are — not the other way around.
          </p>
        </section>

        {/* Who Runs It */}
        <section className="py-16 border-b border-stone-800">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">WHO RUNS IT</h2>
          <p className="text-lg text-stone-300 max-w-3xl">
            Dawn — founder of Decode Horsemanship. She&apos;s worked with horses every day for years, and with people for longer than that. She&apos;s not selling a method. She&apos;s telling you what&apos;s true for your horse, or the horse you haven&apos;t met yet.
          </p>
        </section>

        {/* Other Ways to Start */}
        <section className="py-16">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[#9E1B32] mb-6">OTHER WAYS TO START</h2>
          <p className="text-lg text-stone-300 mb-4">
            Not ready for lessons yet? <Link href="/no-reins" className="text-[#9E1B32] hover:text-[#b82e45] transition-colors">No Reins</Link> and <Link href="/groundwork" className="text-[#9E1B32] hover:text-[#b82e45] transition-colors">Groundwork</Link> are single-day ways to find out if this is for you.
          </p>
          <p className="text-lg text-stone-300">
            Already sure? <Link href="/" className="text-[#9E1B32] hover:text-[#b82e45] transition-colors">Meet our horses</Link> — some of them are ready to come home.
          </p>
        </section>

      </div>
    </div>
  );
}
