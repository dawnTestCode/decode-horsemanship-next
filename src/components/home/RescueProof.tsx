import { siteConfig } from '@/config/siteConfig';

const steps = [
  {
    title: 'Rescue',
    body: 'We attend auctions and work with kill buyers to pull horses from the slaughter pipeline.',
  },
  {
    title: 'Rehabilitate',
    body: 'Veterinary care, proper nutrition, and patient training for the physical and emotional damage they arrive with.',
  },
  {
    title: 'Rehome',
    body: 'Each horse is matched carefully with the right adopter, with support that continues after adoption.',
  },
];

export default function RescueProof() {
  return (
    <section id="mission" className="py-20 px-4 bg-stone-900/30 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-3">Horses &amp; rescue</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-4">
            The horses are not teaching tools. They are partners.
          </h2>
          <p className="text-lg text-stone-400">
            Decode rescues, rehabilitates, and rehomes horses from the auction and slaughter pipeline. That work
            shapes every experience here: patience matters, pressure has consequences, and trust cannot be rushed.
          </p>
        </div>

        <dl className="flex flex-wrap justify-center gap-x-16 gap-y-6 mb-12 text-center">
          {siteConfig.rescueStats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="text-stone-400 text-sm">{stat.label}</dt>
              <dd className="text-3xl md:text-4xl font-bold text-red-500 mb-1">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {steps.map((step) => (
            <div key={step.title} className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
              <h3 className="text-lg font-semibold text-stone-100 mb-2">{step.title}</h3>
              <p className="text-stone-400">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#horses"
            className="inline-block px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Meet available horses
          </a>
        </div>
      </div>
    </section>
  );
}
