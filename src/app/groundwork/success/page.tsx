'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Calendar, ArrowRight, Mail, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function ConfirmationCode() {
  const searchParams = useSearchParams();
  const confirmationCode = searchParams.get('code') || 'GW-XXXXXX';

  return (
    <p className="font-mono text-2xl font-medium text-groundwork-dark">
      {confirmationCode}
    </p>
  );
}

export default function GroundworkSuccessPage() {
  const [pricing, setPricing] = useState({ depositAmount: 20000, fullPrice: 85000 });

  useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase
        .from('programs')
        .select('deposit_amount, full_price')
        .eq('slug', 'groundwork')
        .single();

      if (data) {
        setPricing({
          depositAmount: data.deposit_amount || 20000,
          fullPrice: data.full_price || 85000,
        });
      }
    };

    fetchPricing();
  }, []);
  return (
    <div className="min-h-screen bg-groundwork-cream font-serif">
      <section className="py-20 px-4 min-h-screen">
        <div className="max-w-lg mx-auto text-center">
          {/* Success icon */}
          <div className="w-16 h-16 bg-groundwork-dark rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="text-groundwork-cream" size={32} strokeWidth={3} />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-medium text-groundwork-dark mb-4">
            We&apos;ve got you down.
          </h1>

          <p className="font-sans text-groundwork-muted text-lg mb-10">
            You&apos;ll hear from Dawn within 48 hours with logistics.
          </p>

          {/* Confirmation card */}
          <div className="bg-white border border-groundwork-border rounded-lg p-8 mb-10 text-left">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-groundwork-border-light">
              <div className="w-12 h-12 bg-groundwork-cream rounded-full flex items-center justify-center">
                <Calendar className="text-groundwork-dark" size={20} />
              </div>
              <div>
                <p className="font-sans text-groundwork-label text-xs uppercase tracking-wide">
                  Confirmation Code
                </p>
                <Suspense fallback={<p className="font-mono text-2xl font-medium text-groundwork-dark">GW-...</p>}>
                  <ConfirmationCode />
                </Suspense>
              </div>
            </div>

            <div className="space-y-4 font-sans text-sm">
              <div className="flex items-start gap-3">
                <Check size={16} className="text-groundwork-dark flex-shrink-0 mt-0.5" />
                <p className="text-groundwork-dark/80">
                  A confirmation email has been sent with all the details.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check size={16} className="text-groundwork-dark flex-shrink-0 mt-0.5" />
                <p className="text-groundwork-dark/80">
                  Your {formatPrice(pricing.depositAmount)} deposit has been processed.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-groundwork-muted flex-shrink-0 mt-0.5" />
                <p className="text-groundwork-muted">
                  The remaining {formatPrice(pricing.fullPrice - pricing.depositAmount)} will be invoiced 14 days before your session.
                </p>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div className="bg-white border border-groundwork-border rounded-lg p-6 mb-10 text-left">
            <h3 className="font-serif text-lg text-groundwork-dark mb-4">What to Bring</h3>
            <ul className="font-sans text-groundwork-muted text-sm space-y-2">
              <li>Closed-toe shoes (boots or sturdy sneakers)</li>
              <li>Long pants</li>
              <li>Layers for weather</li>
            </ul>
            <p className="font-sans text-groundwork-label text-xs mt-4 pt-4 border-t border-groundwork-border-light">
              8:30 AM to 4:00 PM. Lunch included.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/groundwork"
              className="px-6 py-3 bg-groundwork-dark hover:bg-groundwork-dark/90 text-groundwork-cream font-sans font-medium rounded transition-colors inline-flex items-center justify-center gap-2"
            >
              Back to Groundwork
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-groundwork-border hover:border-groundwork-muted text-groundwork-muted hover:text-groundwork-dark font-sans font-medium rounded transition-colors"
            >
              Return to Decode
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-groundwork-dark text-groundwork-cream">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-serif text-lg mb-6">Questions?</p>
          <div className="font-sans text-sm text-groundwork-cream/70 space-y-2">
            <p className="flex items-center justify-center gap-2">
              <Mail size={14} className="text-groundwork-cream/50" />
              <a href="mailto:groundwork@decodehorsemanship.com" className="hover:text-groundwork-cream">
                groundwork@decodehorsemanship.com
              </a>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone size={14} className="text-groundwork-cream/50" />
              <a href="tel:+19192442647" className="hover:text-groundwork-cream">
                (919) 244-2647
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
