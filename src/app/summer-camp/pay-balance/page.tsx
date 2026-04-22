'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, CreditCard, Sun, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Registration {
  id: string;
  confirmation_code: string;
  camper_first_name: string;
  camper_last_name: string;
  tier: string;
  session_1: string;
  session_2: string | null;
  parent_name: string;
  parent_email: string;
  deposit_paid: number;
  balance_due: number;
  balance_paid: number;
  status: string;
}

interface Session {
  session_key: string;
  name: string;
  start_date: string;
  end_date: string;
}

function PayBalanceContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') || '';

  const [confirmationCode, setConfirmationCode] = useState(codeFromUrl);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (codeFromUrl) {
      lookupRegistration(codeFromUrl);
    }
  }, [codeFromUrl]);

  useEffect(() => {
    async function fetchSessions() {
      const { data } = await supabase
        .from('summer_camp_sessions')
        .select('session_key, name, start_date, end_date');
      if (data) setSessions(data);
    }
    fetchSessions();
  }, []);

  const lookupRegistration = async (code: string) => {
    setLoading(true);
    setError(null);
    setRegistration(null);

    const formattedCode = code.toUpperCase().trim();

    const { data, error: fetchError } = await supabase
      .from('summer_camp_registrations')
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
      const response = await supabase.functions.invoke('summer-camp-balance-checkout', {
        body: {
          registrationId: registration.id,
          confirmationCode: registration.confirmation_code,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }

      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setSubmitting(false);
    }
  };

  const getSessionName = (sessionKey: string) => {
    const session = sessions.find((s) => s.session_key === sessionKey);
    return session ? session.name : sessionKey;
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(0)}`;

  const remainingBalance = registration ? registration.balance_due - (registration.balance_paid || 0) : 0;

  const isFullyPaid = remainingBalance <= 0;

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-stone-900 to-black min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/summer-camp"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-300 text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Summer Camp
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Sun className="text-amber-400" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Pay Camp Balance</h1>
          </div>
          <p className="text-stone-400">Enter your confirmation code to pay your remaining balance.</p>
        </div>

        {/* Lookup form */}
        {!registration && (
          <form onSubmit={handleLookup} className="mb-8">
            <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-6">
              <label className="block text-sm text-stone-400 mb-2">Confirmation Code</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                  placeholder="SC-XXXXXX"
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-4 py-3
                    text-stone-200 placeholder-stone-600 font-mono text-lg tracking-wider
                    focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30
                    transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !confirmationCode.trim()}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700
                    text-white font-semibold rounded-lg transition-colors
                    disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Look Up'}
                </button>
              </div>
              <p className="text-stone-600 text-xs mt-2">
                Your confirmation code was emailed when you registered.
              </p>
            </div>
          </form>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Registration details */}
        {registration && (
          <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-6">
            {/* Camper info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-800">
              <div className="w-12 h-12 bg-amber-900/30 rounded-full flex items-center justify-center">
                <Sun className="text-amber-400" size={24} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {registration.camper_first_name} {registration.camper_last_name}
                </p>
                <p className="text-stone-500 text-sm font-mono">{registration.confirmation_code}</p>
              </div>
            </div>

            {/* Details table */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Program</span>
                <span className="text-stone-300">
                  {registration.tier === 'explorers' ? 'Explorers (Ages 6–9)' : 'Trailblazers (Ages 10–14)'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Session</span>
                <span className="text-stone-300">
                  {getSessionName(registration.session_1)}
                  {registration.session_2 && ` & ${getSessionName(registration.session_2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Parent/Guardian</span>
                <span className="text-stone-300">{registration.parent_name}</span>
              </div>
              <div className="border-t border-stone-800 pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Deposit Paid</span>
                  <span className="text-green-400">{formatCurrency(registration.deposit_paid)}</span>
                </div>
                {registration.balance_paid > 0 && (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-stone-500">Additional Payments</span>
                    <span className="text-green-400">{formatCurrency(registration.balance_paid)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold mt-3">
                  <span className="text-stone-300">Balance Due</span>
                  <span className={isFullyPaid ? 'text-green-400' : 'text-amber-400'}>
                    {isFullyPaid ? 'Paid in Full' : formatCurrency(remainingBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay button or paid message */}
            {isFullyPaid ? (
              <div className="bg-green-900/30 border border-green-800 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="text-green-300 font-semibold">All Paid Up!</p>
                  <p className="text-green-400/70 text-sm">
                    Your balance has been paid in full. See you at camp!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={handlePayBalance}
                  disabled={submitting}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700
                    text-white font-semibold rounded-xl transition-colors
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
                      Pay {formatCurrency(remainingBalance)}
                    </>
                  )}
                </button>
                <p className="text-stone-600 text-xs text-center mt-3">Secure payment powered by Stripe</p>
              </>
            )}

            {/* Look up different code */}
            <button
              onClick={() => {
                setRegistration(null);
                setConfirmationCode('');
                setError(null);
              }}
              className="w-full mt-4 py-2 text-stone-500 hover:text-stone-300 text-sm transition-colors"
            >
              Look up a different registration
            </button>
          </div>
        )}

        {/* Help text */}
        <p className="text-stone-600 text-sm text-center mt-8">
          Questions? Email us at{' '}
          <a href="mailto:dawn@decodehorsemanship.com" className="text-red-500 hover:text-red-400">
            dawn@decodehorsemanship.com
          </a>
        </p>
      </div>
    </section>
  );
}

export default function SummerCampPayBalancePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      }
    >
      <PayBalanceContent />
    </Suspense>
  );
}
