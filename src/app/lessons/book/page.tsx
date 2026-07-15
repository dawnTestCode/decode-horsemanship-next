'use client';

import Script from 'next/script';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

export default function BookLessonPage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f5f0e8] leading-tight mb-6">
            Book time with us.
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-3xl">
            Tell us a little about where you are, and we&apos;ll go from there.
          </p>
        </div>
      </section>

      {/* Acuity Scheduling Embed */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-900/30 rounded-xl border border-stone-800 overflow-hidden">
            <iframe
              src="https://app.acuityscheduling.com/schedule.php?owner=39789893&ref=embedded_csp"
              title="Schedule Appointment"
              width="100%"
              height="800"
              frameBorder="0"
              allow="payment"
              className="w-full min-h-[800px]"
            />
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-stone-500 mb-2">Questions before booking?</p>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
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
