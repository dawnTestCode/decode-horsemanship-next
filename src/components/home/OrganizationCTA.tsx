import Link from 'next/link';

const useCases = ['Leadership presence', 'Trust and communication', 'Team dynamics', 'Organizational change'];

export default function OrganizationCTA() {
  return (
    <section id="teams" className="py-20 px-4 bg-black border-b border-stone-800 scroll-mt-20">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">For teams and organizations</p>
        <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-6">
          When the pattern is hard to name, let the horse make it visible.
        </h2>
        <p className="text-lg text-stone-400 mb-8">
          Leadership gaps, mixed signals, stalled trust, and change fatigue do not disappear because a team has
          discussed them. A ground-based experience with horses gives the group something real to respond
          to—then a skilled facilitator helps turn what happened into useful language and next steps.
        </p>

        <ul className="flex flex-wrap justify-center gap-3 mb-10">
          {useCases.map((label) => (
            <li
              key={label}
              className="px-4 py-2 text-sm text-stone-200 bg-stone-900/60 border border-stone-700 rounded-full"
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/corporate#inquiry"
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Plan a team experience
          </Link>
          <Link
            href="/corporate"
            className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            See how the work happens
          </Link>
        </div>
        <p className="mt-6 text-sm text-stone-400">
          No riding. No horse experience required. Programs are shaped around the organization&rsquo;s actual goals.
        </p>
      </div>
    </section>
  );
}
