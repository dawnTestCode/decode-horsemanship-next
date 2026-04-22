import { siteConfig } from '@/config/siteConfig';

export default function StatsBar() {
  return (
    <section className="bg-red-900/20 border-y border-red-900/30 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {siteConfig.stats.map((stat, index) => (
          <div key={index}>
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">{stat.value}</div>
            <div className="text-stone-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
