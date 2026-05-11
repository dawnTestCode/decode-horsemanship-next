'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Heart, ArrowRight } from 'lucide-react';

function ConfirmationCode() {
  const searchParams = useSearchParams();
  const confirmationCode = searchParams.get('code') || 'WR-XXXXXX';

  return (
    <p className="font-mono text-2xl font-bold text-white">
      {confirmationCode}
    </p>
  );
}

export default function WomensRetreatSuccessPage() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-stone-900 to-black min-h-screen">
      <div className="max-w-lg mx-auto text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="text-white" size={32} strokeWidth={3} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          You&apos;re in.
        </h1>

        <p className="text-stone-400 text-lg mb-10">
          Check your email for confirmation details.
        </p>

        {/* Confirmation card */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-8 mb-10 text-left">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-800">
            <div className="w-12 h-12 bg-amber-900/30 rounded-full flex items-center justify-center">
              <Heart className="text-amber-500" size={20} />
            </div>
            <div>
              <p className="text-stone-500 text-xs uppercase tracking-wide mb-1">
                Confirmation Code
              </p>
              <Suspense fallback={<p className="font-mono text-2xl font-bold text-white">WR-...</p>}>
                <ConfirmationCode />
              </Suspense>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-stone-300">
                A confirmation email has been sent with all the details.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-stone-300">
                Your payment has been processed.
              </p>
            </div>
          </div>
        </div>

        {/* What to bring */}
        <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-6 mb-10 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">What to Bring</h3>
          <ul className="text-stone-400 text-sm space-y-2">
            <li>• Boots or closed-toe shoes</li>
            <li>• Long pants</li>
            <li>• A jacket in the cooler months</li>
          </ul>
          <p className="text-stone-500 text-sm mt-4 italic">
            Lunch is included.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/eal/no-reins"
            className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            Back to No Reins
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold rounded-lg transition-colors"
          >
            Return to Decode
          </Link>
        </div>

        {/* Questions */}
        <p className="text-stone-600 text-sm">
          Questions? Email us at{' '}
          <a href="mailto:dawn@decodehorsemanship.com" className="text-amber-500 hover:text-amber-400">
            dawn@decodehorsemanship.com
          </a>
        </p>
      </div>
    </section>
  );
}
