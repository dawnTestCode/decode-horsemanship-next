'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft } from 'lucide-react';

const HEARD_ABOUT_OPTIONS = [
  'Facebook',
  'Instagram',
  'Friend/Family',
  'Google Search',
  'Other',
];

export default function FoalLessonsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    heardAbout: '',
    interestNotes: '',
    honeypot: '', // Hidden field for spam prevention
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If honeypot is filled, silently reject (it's a bot)
    if (formData.honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/foal-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          heardAbout: formData.heardAbout || null,
          interestNotes: formData.interestNotes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sign up');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ChevronLeft size={16} />
          Back to Decode Horsemanship
        </Link>
      </header>

      <main className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <section className="text-center py-12 md:py-20">
            <p className="text-lg md:text-xl uppercase tracking-[0.15em] text-[#9E1B32] font-semibold mb-4">
              Coming Summer 2026
            </p>
            <h1 className="font-['Barlow_Condensed',sans-serif] text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Foal Handling Lessons
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
              Learn how to work with young horses from the ground up — literally.
              We&apos;re expecting a Gypsy Vanner foal any day now, and once they&apos;re
              ready for visitors, you could be part of their early training.
            </p>
          </section>

          {/* Photo of Cali */}
          <section className="mb-16">
            <img
              src="/cali.png"
              alt="Cali, our expecting Gypsy Vanner mare"
              className="w-full rounded-lg"
            />
            <p className="text-white/50 text-sm text-center mt-3">
              Cali, our expecting Gypsy Vanner mare
            </p>
          </section>

          {/* What to expect */}
          <section className="mb-16">
            <h2 className="font-['Barlow_Condensed',sans-serif] text-2xl font-semibold mb-6">
              What to Expect
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                These lessons are designed for people who want to understand horses from the
                beginning. Working with a foal means learning the foundations: how to approach,
                how to touch, how to communicate — all before the horse has formed habits (good or bad).
              </p>
              <p>
                Foals need 3–4 weeks after birth before they can safely work with people outside
                the family. Once our foal is ready (estimated early-to-mid August), we&apos;ll email
                everyone on the waitlist with real dates and booking details.
              </p>
            </div>
          </section>

          {/* Signup form or success message */}
          <section className="bg-white/5 rounded-xl p-8 border border-white/10">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#9E1B32] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-white" />
                </div>
                <h3 className="font-['Barlow_Condensed',sans-serif] text-2xl font-semibold mb-4">
                  You&apos;re on the list!
                </h3>
                <p className="text-white/70 max-w-md mx-auto">
                  We&apos;ll email you the moment the foal is ready for visitors.
                  Keep an eye on your inbox around early-to-mid August.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-['Barlow_Condensed',sans-serif] text-2xl font-semibold mb-2">
                  Join the Waitlist
                </h2>
                <p className="text-white/60 mb-8">
                  Be the first to know when lessons are available.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field - hidden from users */}
                  <input
                    type="text"
                    name="website"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                      Name <span className="text-[#9E1B32]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#9E1B32] focus:outline-none focus:ring-1 focus:ring-[#9E1B32] transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                      Email <span className="text-[#9E1B32]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#9E1B32] focus:outline-none focus:ring-1 focus:ring-[#9E1B32] transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                      Phone <span className="text-white/40">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#9E1B32] focus:outline-none focus:ring-1 focus:ring-[#9E1B32] transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* How did you hear about us */}
                  <div>
                    <label htmlFor="heardAbout" className="block text-sm font-medium text-white/80 mb-2">
                      How did you hear about us? <span className="text-white/40">(optional)</span>
                    </label>
                    <select
                      id="heardAbout"
                      value={formData.heardAbout}
                      onChange={(e) => setFormData({ ...formData, heardAbout: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#9E1B32] focus:outline-none focus:ring-1 focus:ring-[#9E1B32] transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#1a1a1a]">Select an option...</option>
                      {HEARD_ABOUT_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#1a1a1a]">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* What are you hoping to learn */}
                  <div>
                    <label htmlFor="interestNotes" className="block text-sm font-medium text-white/80 mb-2">
                      What are you hoping to learn? <span className="text-white/40">(optional)</span>
                    </label>
                    <textarea
                      id="interestNotes"
                      rows={4}
                      value={formData.interestNotes}
                      onChange={(e) => setFormData({ ...formData, interestNotes: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#9E1B32] focus:outline-none focus:ring-1 focus:ring-[#9E1B32] transition-colors resize-none"
                      placeholder="Tell us about your experience with horses and what you'd like to get out of these lessons..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#9E1B32] hover:bg-[#8a1829] disabled:bg-[#9E1B32]/50 text-white font-semibold rounded-lg transition-colors"
                  >
                    {submitting ? 'Joining...' : 'Join the Waitlist'}
                  </button>
                </form>
              </>
            )}
          </section>

          {/* Footer note */}
          <section className="text-center mt-12 text-white/40 text-sm">
            <p>
              Questions? Email us at{' '}
              <a href="mailto:dawn@decodehorsemanship.com" className="text-[#9E1B32] hover:underline">
                dawn@decodehorsemanship.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
