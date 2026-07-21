'use client';

import Script from 'next/script';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

export default function BookHomeschoolGroupPage() {
  return (
    <div className="bg-[#0c0a09]">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4" style={{ background: 'linear-gradient(180deg, #0c0a09 0%, #150c0c 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#dc143c] uppercase mb-4">
            Kids & Family Lessons
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f5f0eb] leading-tight mb-6">
            Book a Homeschool Group Block
          </h1>
          <p className="text-lg md:text-xl text-[#b8a8a0] max-w-3xl mb-4">
            Weekly class for homeschool co-ops and families.
          </p>
          <p className="text-sm text-[#a89890]">
            Looking for a different format?{' '}
            <Link href="/kids-lessons/book/private" className="text-[#dc143c] hover:underline">
              Private Lesson
            </Link>
            {' · '}
            <Link href="/kids-lessons/book/small-group" className="text-[#dc143c] hover:underline">
              Small Group
            </Link>
          </p>
        </div>
      </section>

      {/* Acuity Scheduling Embed */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#150c0c] rounded-xl border border-[#3a2020] overflow-hidden">
            <iframe
              src="https://app.acuityscheduling.com/schedule.php?owner=39789893&appointmentType=96034374&ref=embedded_csp"
              title="Schedule Homeschool Group Block"
              width="100%"
              height="800"
              frameBorder="0"
              allow="payment"
              className="w-full min-h-[800px]"
            />
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-[#a89890] mb-2">Questions before booking?</p>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="inline-flex items-center gap-2 text-[#dc143c] hover:text-[#b01030] transition-colors"
            >
              <Phone size={18} />
              Text or call: {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Acuity embed script */}
      <Script
        src="https://embed.acuityscheduling.com/js/embed.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
