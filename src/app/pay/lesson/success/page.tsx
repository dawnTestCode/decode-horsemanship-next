import { Check } from 'lucide-react';
import Link from 'next/link';

export default function LessonSuccessPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-[#9E1B32] rounded-full flex items-center justify-center mx-auto mb-8">
          <Check size={40} className="text-white" />
        </div>

        <h1 className="font-['Barlow_Condensed',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Payment Complete
        </h1>

        <p className="text-white/70 mb-8">
          Thank you! Your lesson payment has been received.
          You should receive a confirmation email shortly.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Back to Decode Horsemanship
        </Link>
      </div>
    </div>
  );
}
