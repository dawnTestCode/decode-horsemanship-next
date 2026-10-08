import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const proofPoints = [
  {
    title: 'Real leadership experience',
    body: 'Dawn brings more than two decades of corporate leadership across tech, healthcare, and finance—alongside over a decade training, rehabilitating, and partnering with horses.',
  },
  {
    title: 'Horses with real histories',
    body: 'The Decode herd includes rescued horses and mustangs. They are not props. Their boundaries, attention, and choices are part of the work.',
  },
  {
    title: 'Small by design',
    body: 'Small groups leave room to notice what is actually happening and connect it to the person, team, or change in front of us.',
  },
];

export default function WhyDecode() {
  return (
    <section id="why-decode" className="py-20 px-4 bg-stone-900/30 border-b border-stone-800 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">Why this works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-4">
            A horse responds to the signal, not the résumé.
          </h2>
          <p className="text-lg text-stone-400">
            People can agree with your words and still brace against your pressure. A horse makes that gap
            visible. Not as a judgment. As information you can use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {proofPoints.map((point) => (
            <div key={point.title} className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
              <h3 className="text-lg font-semibold text-stone-100 mb-2">{point.title}</h3>
              <p className="text-stone-400">{point.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/about/dawn"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            Meet Dawn and the herd
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
