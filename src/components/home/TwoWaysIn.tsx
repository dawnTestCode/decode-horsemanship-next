import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function TwoWaysIn() {
  return (
    <section className="py-16 px-4 bg-black border-b border-stone-800">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors">
            <h3 className="text-xl font-bold text-stone-100 mb-3">Decode the Desire</h3>
            <p className="text-stone-400 mb-4">
              Never had one, but you think about it more than you say out loud? You don&apos;t have to already own a horse to start.
            </p>
          </div>
          <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors">
            <h3 className="text-xl font-bold text-stone-100 mb-3">Decode the Noise</h3>
            <p className="text-stone-400 mb-4">
              Already have a horse? You don&apos;t need one more opinion. You need someone to decode the noise.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            See Lessons
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
