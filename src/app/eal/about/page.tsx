'use client';

import Link from 'next/link';
import { Award, Heart, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { useEALImages } from '@/hooks/useEALImages';

export default function AboutPage() {
  const { getImageUrl, getImageStyle } = useEALImages();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Meet <span className="text-red-500">Dawn</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8">
            From corporate leadership to equine transformation
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="aspect-[4/5] bg-stone-800 rounded-2xl overflow-hidden">
                {getImageUrl("dawn_portrait") ? (
                  <img
                    src={getImageUrl("dawn_portrait")!}
                    alt="Dawn"
                    className="w-full h-full object-cover"
                    style={getImageStyle("dawn_portrait")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600">
                    <span className="text-sm">Photo Coming Soon</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">
                A Journey of{" "}
                <span className="text-red-500">Transformation</span>
              </h2>
              <div className="space-y-4 text-stone-400">
                <p>
                  Before horses became my life&apos;s work, I spent over 25 years in
                  corporate America — managing teams since 1999, consulting
                  across Tech, Healthcare, and Finance, and teaching at
                  conferences worldwide. I understood leadership, communication,
                  and the weight of responsibility that comes with both.
                </p>
                <p>
                  But something was missing. The corporate world taught me how
                  to achieve, but horses taught me how to connect—truly
                  connect—with myself and others.
                </p>
                <p>
                  That transformation didn&apos;t happen overnight. It came through
                  years of working with rescue horses, learning from their
                  honesty, and discovering that the same principles that help a
                  horse trust can help a person transform.
                </p>
              </div>
            </div>
          </div>

          {/* Background Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">
                Corporate Background
              </h3>
              <p className="text-stone-400">
                Over 25 years of leadership experience in corporate
                environments, including team development, strategic planning,
                organizational change, and external consulting across Tech,
                Healthcare, and Finance. This foundation is the backbone of how
                Decode approaches equine-assisted learning for professional
                development.
              </p>
            </div>
            <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-stone-100 mb-3">
                Horsemanship Journey
              </h3>
              <p className="text-stone-400">
                What started as a personal passion evolved into a calling.
                Working with rescue horses taught me patience, presence, and the
                transformative power of non-verbal communication. Every horse
                has been a teacher.
              </p>
            </div>
          </div>

          {/* Why EAL Section */}
          <div className="bg-gradient-to-r from-red-900/20 to-stone-900/50 p-8 md:p-12 rounded-2xl border border-red-900/30 mb-16">
            <h2 className="text-3xl font-bold mb-6">
              Why Equine Assisted Learning?
            </h2>
            <div className="space-y-4 text-stone-300">
              <p>
                Horses don&apos;t care about your job title. They don&apos;t respond to
                manipulation or pretense. They respond to authenticity, clear
                intention, and emotional congruence.
              </p>
              <p>
                In a world where we&apos;re constantly performing, horses offer
                something rare: immediate, honest feedback. They mirror our
                emotional state, challenge our assumptions about communication,
                and create space for genuine self-discovery.
              </p>
              <p>
                I&apos;ve watched executives discover their authentic leadership
                voice. I&apos;ve seen individuals break through barriers they didn&apos;t
                know they had. And I&apos;ve witnessed the profound impact of
                learning from an animal that asks nothing but presence.
              </p>
            </div>
          </div>

          {/* Credentials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Credentials & Training
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 text-center">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-red-500" size={24} />
                </div>
                <h4 className="font-semibold text-stone-200 mb-2">
                  EAL Certification
                </h4>
                <p className="text-sm text-stone-500">In Progress</p>
              </div>
              <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 text-center">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-red-500" size={24} />
                </div>
                <h4 className="font-semibold text-stone-200 mb-2">
                  Natural Horsemanship
                </h4>
                <p className="text-sm text-stone-500">5+ Years of Hands-on, 7 Days a Week Experience</p>
              </div>
              <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 text-center">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-red-500" size={24} />
                </div>
                <h4 className="font-semibold text-stone-200 mb-2">
                  Corporate Leadership
                </h4>
                <p className="text-sm text-stone-500">25+ Years</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-stone-400 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re seeking personal growth or looking to bring
              transformative learning to your team, I&apos;d love to connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/eal"
                className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                Explore Our Programs
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/eal/contact"
                className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
