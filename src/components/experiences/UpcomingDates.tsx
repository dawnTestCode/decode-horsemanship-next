'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';
import { manualUpcomingEvents } from '@/config/experiences';
import { UPCOMING_PROGRAM_SLUGS, buildUpcomingEvents } from './upcomingEvents';

export default function UpcomingDates() {
  const { programs, loading, formatDate, formatTime } = usePrograms(UPCOMING_PROGRAM_SLUGS);
  // A fetch error leaves `programs` empty, so the section falls back to manual events / empty state
  const events = useMemo(() => buildUpcomingEvents(programs, manualUpcomingEvents, new Date()), [programs]);

  return (
    <section id="upcoming" className="py-16 px-4 bg-stone-900/30 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Upcoming dates</h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-stone-900/50 p-5 rounded-xl border border-stone-800 motion-safe:animate-pulse">
                <div className="h-5 bg-stone-800 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-stone-800 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="max-w-md mx-auto bg-stone-900/50 p-6 rounded-xl border border-stone-800 text-center">
            <p className="text-stone-500 text-sm mb-4">No upcoming dates scheduled yet.</p>
            <Link
              href="/contact"
              className="text-red-500 hover:text-red-400 font-medium text-sm inline-flex items-center gap-1"
            >
              Get notified
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <li key={event.id} className="flex flex-col bg-stone-900/50 p-5 rounded-xl border border-stone-800">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500 mb-1">{event.name}</p>
                    <p className="font-semibold text-stone-100">
                      <time dateTime={event.startDate}>{formatDate(event.startDate)}</time>
                    </p>
                    {event.source === 'database' && event.startTime && (
                      <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                        <Clock size={14} aria-hidden="true" />
                        {formatTime(event.startTime)}
                        {event.endTime && ` – ${formatTime(event.endTime)}`}
                      </p>
                    )}
                    {event.source === 'manual' && (event.facilitator || event.priceLabel) && (
                      <p className="text-sm text-stone-400 mt-1">
                        {[event.facilitator && `with ${event.facilitator}`, event.priceLabel].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  {event.source === 'database' && (
                    <span
                      className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${
                        event.isFull ? 'bg-stone-800 text-stone-500' : 'bg-red-900/20 text-red-400'
                      }`}
                    >
                      {event.isFull ? 'Sold Out' : `${event.spotsRemaining} ${event.spotsRemaining === 1 ? 'spot' : 'spots'} left`}
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  {event.source === 'database' ? (
                    event.isFull ? (
                      <p className="w-full px-4 py-2.5 bg-stone-800 text-stone-500 font-medium rounded-lg text-center text-sm">
                        Sold Out
                      </p>
                    ) : (
                      <Link
                        href={`/${event.slug}/register?date=${event.startDate}`}
                        className="block w-full px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white font-medium rounded-lg transition-colors text-center text-sm"
                      >
                        Reserve Your Spot
                        <span className="sr-only">: {event.name}, {formatDate(event.startDate)}</span>
                      </Link>
                    )
                  ) : event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white font-medium rounded-lg transition-colors text-center text-sm"
                    >
                      {event.registrationLabel}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full px-4 py-2.5 bg-stone-800 text-stone-500 font-medium rounded-lg text-center text-sm cursor-not-allowed"
                    >
                      Registration link coming soon
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
