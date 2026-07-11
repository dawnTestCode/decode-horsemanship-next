'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

const LESSON_PRICE = 10000; // $100 in cents

export default function PayLessonPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/lesson-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, amount: LESSON_PRICE }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#9E1B32] mb-2">
            Decode Horsemanship
          </p>
          <h1 className="font-['Barlow_Condensed',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Single Lesson
          </h1>
          <p className="text-white/60">
            $100
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm text-white/70 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#9E1B32] focus:outline-none focus:ring-1 focus:ring-[#9E1B32] transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-white/70 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#9E1B32] focus:outline-none focus:ring-1 focus:ring-[#9E1B32] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#9E1B32] hover:bg-[#8a1829] disabled:bg-[#9E1B32]/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Redirecting to payment...
              </>
            ) : (
              <>
                <Check size={20} />
                Pay $100
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-8">
          Secure payment processed by Stripe
        </p>
      </div>
    </div>
  );
}
