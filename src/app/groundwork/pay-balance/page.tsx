'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, CreditCard, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Registration {
  id: string;
  confirmation_code: string;
  first_name: string;
  last_name: string;
  email: string;
  session_date: string;
  deposit_amount: number;
  total_price: number;
  balance_due: number;
  status: string;
}

function PayBalanceContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') || '';

  const [confirmationCode, setConfirmationCode] = useState(codeFromUrl);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (codeFromUrl) {
      lookupRegistration(codeFromUrl);
    }
  }, [codeFromUrl]);

  const lookupRegistration = async (code: string) => {
    setLoading(true);
    setError(null);
    setRegistration(null);

    const formattedCode = code.toUpperCase().trim();

    const { data, error: fetchError } = await supabase
      .from('groundwork_registrations')
      .select('*')
      .eq('confirmation_code', formattedCode)
      .single();

    setLoading(false);

    if (fetchError || !data) {
      setError('Registration not found. Please check your confirmation code.');
      return;
    }

    if (data.status === 'cancelled') {
      setError('This registration has been cancelled.');
      return;
    }

    setRegistration(data);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationCode.trim()) {
      lookupRegistration(confirmationCode);
    }
  };

  const handlePayBalance = async () => {
    if (!registration) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/groundwork-balance-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: registration.id,
          confirmationCode: registration.confirmation_code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === 'TBA') return 'Date TBA';
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(0)}`;

  const isFullyPaid = registration?.status === 'paid_in_full';

  return (
    <section className="py-12 px-4 bg-groundwork-cream min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/groundwork"
            className="inline-flex items-center gap-2 text-groundwork-muted hover:text-groundwork-dark text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Groundwork
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-groundwork-dark mb-2">
            Pay Your Balance
          </h1>
          <p className="text-groundwork-muted font-sans text-sm">
            Enter your confirmation code to pay your remaining balance.
          </p>
        </div>

        {/* Lookup form */}
        {!registration && (
          <form onSubmit={handleLookup} className="mb-8">
            <div className="bg-white rounded-lg border border-groundwork-border p-6">
              <label className="block text-sm text-groundwork-muted mb-2 font-sans">
                Confirmation Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                  placeholder="GW-XXXXXX"
                  className="flex-1 bg-white border border-groundwork-border rounded px-4 py-3
                    text-groundwork-dark placeholder-groundwork-label/50 font-mono text-lg tracking-wider
                    focus:border-groundwork-dark focus:outline-none focus:ring-1 focus:ring-groundwork-dark/20
                    transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !confirmationCode.trim()}
                  className="px-6 py-3 bg-groundwork-dark hover:bg-groundwork-dark/90 disabled:bg-groundwork-border
                    text-groundwork-cream font-sans font-medium rounded transition-colors
                    disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Look Up'}
                </button>
              </div>
              <p className="text-groundwork-label text-xs mt-2 font-sans">
                Your confirmation code was emailed when you registered.
              </p>
            </div>
          </form>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Registration details */}
        {registration && (
          <div className="bg-white rounded-lg border border-groundwork-border p-6">
            {/* Name and code */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-groundwork-border-light">
              <div>
                <p className="text-groundwork-dark font-serif text-xl">
                  {registration.first_name} {registration.last_name}
                </p>
                <p className="text-groundwork-label text-sm font-mono">{registration.confirmation_code}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6 font-sans text-sm">
              <div className="flex justify-between">
                <span className="text-groundwork-muted">Session Date</span>
                <span className="text-groundwork-dark">{formatDate(registration.session_date)}</span>
              </div>
              <div className="border-t border-groundwork-border-light pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-groundwork-muted">Total Program Fee</span>
                  <span className="text-groundwork-dark">{formatCurrency(registration.total_price)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-groundwork-muted">Deposit Paid</span>
                  <span className="text-green-700">{formatCurrency(registration.deposit_amount)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium mt-3 pt-3 border-t border-groundwork-border-light">
                  <span className="text-groundwork-dark">Balance Due</span>
                  <span className={isFullyPaid ? 'text-green-700' : 'text-groundwork-dark'}>
                    {isFullyPaid ? 'Paid in Full' : formatCurrency(registration.balance_due)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay button or paid message */}
            {isFullyPaid ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <p className="text-green-800 font-medium font-sans">All Paid Up!</p>
                  <p className="text-green-700 text-sm font-sans">
                    Your balance has been paid in full. We look forward to seeing you.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={handlePayBalance}
                  disabled={submitting}
                  className="w-full py-4 bg-groundwork-dark hover:bg-groundwork-dark/90 disabled:bg-groundwork-border
                    text-groundwork-cream font-sans font-medium rounded transition-colors
                    disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Pay {formatCurrency(registration.balance_due)}
                    </>
                  )}
                </button>
                <p className="text-groundwork-label text-xs text-center mt-3 font-sans">
                  Secure payment powered by Stripe. Promo codes can be applied at checkout.
                </p>
              </>
            )}

            {/* Look up different code */}
            <button
              onClick={() => {
                setRegistration(null);
                setConfirmationCode('');
                setError(null);
              }}
              className="w-full mt-4 py-2 text-groundwork-muted hover:text-groundwork-dark text-sm font-sans transition-colors"
            >
              Look up a different registration
            </button>
          </div>
        )}

        {/* Help text */}
        <p className="text-groundwork-label text-sm text-center mt-8 font-sans">
          Questions? Email us at{' '}
          <a href="mailto:groundwork@decodehorsemanship.com" className="text-groundwork-dark hover:underline">
            groundwork@decodehorsemanship.com
          </a>
        </p>
      </div>
    </section>
  );
}

export default function GroundworkPayBalancePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-groundwork-cream flex items-center justify-center">
          <Loader2 className="animate-spin text-groundwork-dark" size={32} />
        </div>
      }
    >
      <PayBalanceContent />
    </Suspense>
  );
}
