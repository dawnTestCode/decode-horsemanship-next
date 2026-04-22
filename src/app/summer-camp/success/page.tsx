'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, ArrowRight, Sun, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const confirmationCode = searchParams.get('code') || 'SC-XXXXXX';

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-stone-900 to-black min-h-screen">
      <div className="max-w-xl mx-auto text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500" size={40} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">You&apos;re All Set!</h1>

        <p className="text-stone-400 text-lg mb-8">
          Your summer camp registration is confirmed. We can&apos;t wait to see your camper at the barn!
        </p>

        {/* Confirmation card */}
        <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-8 mb-8 text-left">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-800">
            <div className="w-12 h-12 bg-amber-900/30 rounded-full flex items-center justify-center">
              <Sun className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-sm">Confirmation Code</p>
              <p className="text-2xl font-mono font-bold text-red-500">{confirmationCode}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-stone-300">A confirmation email has been sent with all the details.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-stone-300">Your $100 deposit has been processed successfully.</p>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-stone-300">
                The remaining balance will be invoiced 2 weeks before your session.
              </p>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-stone-900/50 rounded-xl border border-stone-800 p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4">What to Bring Each Day</h3>
          <ul className="text-stone-400 text-sm space-y-2">
            <li>• Closed-toe shoes (boots preferred)</li>
            <li>• Long pants</li>
            <li>• Water bottle & sack lunch</li>
            <li>• Sunscreen</li>
            <li>• Weather-appropriate layers</li>
          </ul>
          <p className="text-stone-500 text-xs mt-4">
            Camp runs 9am – 1pm daily. Arrive by 8:50am for check-in.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/summer-camp"
            className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            Back to Summer Camp
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-stone-600 hover:border-stone-500 text-stone-300 hover:text-white font-semibold rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>

        {/* Contact */}
        <p className="text-stone-600 text-sm mt-8">
          Questions? Email us at{' '}
          <a href="mailto:dawn@decodehorsemanship.com" className="text-red-500 hover:text-red-400">
            dawn@decodehorsemanship.com
          </a>
        </p>
      </div>
    </section>
  );
}

export default function SummerCampSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
