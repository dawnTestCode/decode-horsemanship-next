import { approvedTestimonials } from '@/config/experiences';

export default function Testimonials() {
  // Renders nothing until owner-approved testimonials are added.
  if (approvedTestimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 px-4 bg-black border-b border-stone-800 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-100 text-center mb-12">In their words</h2>
        <ul className="grid md:grid-cols-3 gap-6">
          {approvedTestimonials.map((t) => (
            <li key={t.attribution + t.program} className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
              <figure>
                <blockquote className="text-stone-300 mb-4">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="text-sm text-stone-500">
                  {t.attribution} · {t.program}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
