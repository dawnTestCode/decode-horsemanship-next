import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const doors = [
  {
    title: 'I’ve never worked with horses.',
    body: 'Good. You are not behind. Start with a ground-based experience built for people who are curious, unsure, or finally ready to find out why horses keep pulling at them.',
    cta: 'Show me a first step',
    href: '/experiences#personal-experiences',
  },
  {
    title: 'I lead people.',
    body: 'Horses make pressure, clarity, trust, and mixed signals visible fast. Build an experience for one leader, a leadership group, or a team that is ready for honest feedback.',
    cta: 'Explore leadership work',
    href: '/corporate',
  },
  {
    title: 'We’re in the middle of change.',
    body: 'A new structure. A difficult handoff. A team that knows the old way is over but cannot see the new one yet. We’ll design the work around the change you are actually carrying.',
    cta: 'Talk through the change',
    href: '/corporate#inquiry',
  },
  {
    title: 'Horses have always been part of me.',
    body: 'Maybe you ride. Maybe you used to. Maybe the wanting never became a life. Come back without having to prove what you know or commit to becoming someone else.',
    cta: 'See horse-centered experiences',
    href: '/experiences#personal-experiences',
  },
];

export default function AudienceRouter() {
  return (
    <section id="start-here" className="py-20 px-4 bg-black border-b border-stone-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">Start here</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-4">
            You don&rsquo;t need the right horse words.
          </h2>
          <p className="text-lg text-stone-400">
            Choose the door that sounds most like you. We&rsquo;ll help with the rest.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doors.map((door) => (
            <li
              key={door.title}
              className="group relative flex flex-col bg-stone-900/50 p-6 rounded-xl border border-stone-800 hover:border-red-700 focus-within:border-red-500 transition-colors"
            >
              <h3 className="text-xl font-bold text-stone-100 mb-3">{door.title}</h3>
              <p className="text-stone-400 mb-6 flex-1">{door.body}</p>
              {/* The link's ::after stretches over the card so the whole card is clickable */}
              <Link
                href={door.href}
                className="inline-flex items-center gap-2 text-red-500 group-hover:text-red-400 font-medium after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
              >
                {door.cta}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
