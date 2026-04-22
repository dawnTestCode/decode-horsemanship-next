import Link from 'next/link';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function EnrollmentCancelledPage() {
  return (
    <PageLayout>
      <section className="min-h-screen py-20 px-4 flex items-center">
        <div className="max-w-lg mx-auto text-center">

          {/* Cancelled icon */}
          <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-stone-500" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Enrollment Cancelled
          </h1>
          <p className="text-stone-400 mb-8">
            No worries — your payment was not processed and no charges were made.
            Your spot has not been reserved.
          </p>

          {/* Helpful info */}
          <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <HelpCircle size={18} className="text-stone-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-stone-300 text-sm font-medium mb-1">
                  Have questions before enrolling?
                </p>
                <p className="text-stone-500 text-sm">
                  We&apos;re happy to chat about our programs and help you decide if
                  they&apos;re right for you. Reach out any time.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/eal"
              className="px-6 py-3 border border-stone-700 hover:border-stone-500
                text-stone-300 hover:text-white rounded-lg text-sm transition-colors
                inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Programs
            </Link>
            <Link
              href="/eal/contact"
              className="px-6 py-3 bg-red-700 hover:bg-red-600
                text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}
