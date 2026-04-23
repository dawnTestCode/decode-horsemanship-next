'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const confirmationCode = searchParams.get('code') || '';

  return (
    <section className="py-12 px-4 bg-groundwork-cream min-h-screen">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-serif font-medium text-groundwork-dark mb-4">
            Payment Complete
          </h1>
          <p className="text-groundwork-muted font-sans">
            Your balance has been paid in full. You&apos;re all set for your Groundwork session.
          </p>
        </div>

        {confirmationCode && (
          <div className="bg-white rounded-lg border border-groundwork-border p-6 mb-8">
            <p className="text-groundwork-muted text-sm font-sans mb-2">Confirmation Code</p>
            <p className="text-2xl font-mono text-groundwork-dark tracking-wider">{confirmationCode}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-groundwork-muted font-sans text-sm">
            A receipt has been sent to your email. If you have any questions, don&apos;t hesitate to reach out.
          </p>

          <Link
            href="/groundwork"
            className="inline-block px-8 py-3 bg-groundwork-dark hover:bg-groundwork-dark/90
              text-groundwork-cream font-sans font-medium rounded transition-colors"
          >
            Back to Groundwork
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function GroundworkPayBalanceSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-groundwork-cream flex items-center justify-center">
          <Loader2 className="animate-spin text-groundwork-dark" size={32} />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
