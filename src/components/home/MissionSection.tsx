export default function MissionSection() {
  return (
    <section id="mission" className="py-20 px-4 bg-stone-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-red-500">Mission</span>
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Every horse deserves a chance. We&apos;re committed to breaking the cycle of neglect and giving horses
            the second chance they deserve.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-100 mb-3">Rescue</h3>
            <p className="text-stone-400">
              We attend auctions and work with kill buyers to pull horses from the slaughter pipeline,
              giving them a lifeline when they need it most.
            </p>
          </div>

          <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-100 mb-3">Rehabilitate</h3>
            <p className="text-stone-400">
              Each horse receives veterinary care, proper nutrition, and patient training to address
              physical and emotional trauma from their past.
            </p>
          </div>

          <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800 hover:border-red-700 transition-colors">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-100 mb-3">Rehome</h3>
            <p className="text-stone-400">
              We carefully match each horse with the right adopter, ensuring a successful partnership
              and providing ongoing support after adoption.
            </p>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
          <h3 className="text-2xl font-bold text-center mb-8">Our Rehabilitation Process</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: 'Intake', desc: 'Vet exam & quarantine' },
              { step: 2, title: 'Recovery', desc: 'Nutrition & health restoration' },
              { step: 3, title: 'Assessment', desc: 'Temperament evaluation' },
              { step: 4, title: 'Training', desc: 'Desensitization & skills' },
              { step: 5, title: 'Matching', desc: 'Finding the perfect home' },
            ].map((item, idx) => (
              <div key={item.step} className="text-center relative">
                <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-stone-200">{item.title}</h4>
                <p className="text-sm text-stone-500">{item.desc}</p>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-red-900/50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
