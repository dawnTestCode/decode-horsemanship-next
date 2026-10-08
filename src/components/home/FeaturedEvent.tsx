import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { getCurrentFeaturedEvent } from '@/config/experiences';

export default function FeaturedEvent() {
  // Past events drop off automatically; nothing renders when no event is current.
  const event = getCurrentFeaturedEvent();
  if (!event) return null;

  return (
    <section id="upcoming" className="py-20 px-4 bg-stone-900/30 border-b border-stone-800 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-red-950/30 to-stone-900/60 border border-red-900/40 rounded-2xl p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">Upcoming at Decode</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-4">{event.title}</h2>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-stone-200 font-medium mb-6">
            <CalendarDays size={18} className="text-red-500 flex-shrink-0" aria-hidden="true" />
            <time dateTime={event.startDate}>{event.displayDate}</time>
            <span aria-hidden="true">·</span>
            <span>{event.location}</span>
          </p>
          <p className="text-lg text-stone-300 mb-4">{event.description}</p>
          <p className="text-stone-400 mb-8">{event.detailLine}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            {event.bookingUrl ? (
              <a
                href={event.bookingUrl}
                className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                View clinic details
              </a>
            ) : (
              // Until the owner-approved event URL exists, route interest to the contact form.
              <Link
                href="/#contact"
                className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                Ask about {event.title}
              </Link>
            )}
            {event.facilitatorUrl && (
              <a
                href={event.facilitatorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                Meet {event.facilitator}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
