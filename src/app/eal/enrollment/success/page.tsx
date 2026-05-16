'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  return (
    <PageLayout>
      <section className="min-h-screen py-20 px-4 flex items-center">
        <div className="max-w-lg mx-auto text-center">

          {/* Success icon */}
          <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-400" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            You&apos;re Enrolled.
          </h1>
          <p className="text-stone-400 mb-8">
            Your spot is confirmed. Check your email for a full confirmation
            with everything you need to know before you arrive.
          </p>

          {/* Confirmation code */}
          {code && (
            <div className="bg-stone-900/80 border border-stone-700 rounded-xl p-6 mb-8">
              <p className="text-stone-400 text-sm mb-2">Your confirmation code</p>
              <p className="text-3xl font-mono font-bold text-red-500 tracking-widest">
                {code}
              </p>
              <p className="text-stone-600 text-xs mt-2">Save this for your records</p>
            </div>
          )}

          {/* What's next */}
          <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-6 mb-8 text-left">
            <p className="text-white font-semibold mb-4">What happens next</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-stone-400 text-sm">
                  A confirmation email is on its way to you now with full details,
                  what to wear, and how to find us.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-stone-400 text-sm">
                  If you paid a deposit, we&apos;ll send a reminder when your balance is due.
                  No action needed right now.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/eal"
              className="px-6 py-3 border border-stone-700 hover:border-stone-500
                text-stone-300 hover:text-white rounded-lg text-sm transition-colors"
            >
              Back to Workshops
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-red-700 hover:bg-red-600
                text-white font-semibold rounded-lg text-sm transition-colors
                inline-flex items-center gap-2"
            >
              Decode Horsemanship Home
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}

export default function EnrollmentSuccessPage() {
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
