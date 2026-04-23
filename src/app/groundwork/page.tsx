import Link from 'next/link';
import { ChevronDown, Mail, Phone, MapPin } from 'lucide-react';

export default function GroundworkPage() {
  return (
    <div className="min-h-screen bg-groundwork-cream text-groundwork-dark font-serif">
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen bg-groundwork-dark flex flex-col items-center justify-center px-6 relative">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-groundwork-cream tracking-tight mb-6">
            Groundwork
          </h1>
          <div className="w-24 h-px bg-groundwork-cream/40 mx-auto mb-8" />
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-groundwork-cream/70 mb-4">
            For men who want something else
          </p>
          <p className="text-xl md:text-2xl font-serif italic text-groundwork-cream/90">
            A day with horses. That&apos;s all. That&apos;s enough.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-groundwork-cream/50">
          <span className="text-xs font-sans uppercase tracking-[0.15em]">continue</span>
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* ─── What It Is ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            What it is
          </p>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>One day at a working horse farm in Chapel Hill, North Carolina.</p>
            <p>A small group of men. Four horses. Real food at midday. Home by four.</p>
            <p>No sharing circle. No journaling. No exercises designed to make you cry.</p>
            <p>The horses show you things. Your only job is to notice.</p>
          </div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-groundwork-border-light" />
      </div>

      {/* ─── Who It's For ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            Who it&apos;s for
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-8">It&apos;s for you if —</p>
          <div className="space-y-4 font-sans text-base md:text-lg text-groundwork-dark/90">
            <p>— You&apos;ve been told to &quot;talk to someone&quot; and it hasn&apos;t worked</p>
            <p>— You&apos;ve outgrown the bar, the golf, the usual</p>
            <p>— You&apos;re not in crisis. You&apos;re just off.</p>
            <p>— You want more than another weekend</p>
          </div>
        </div>
      </section>

      {/* ─── What Happens ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-groundwork-dark text-groundwork-cream">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-cream/60 mb-8">
            What happens
          </p>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>
              You arrive. You get coffee. You go into the arena with the horses — no rope, no task.
              You watch. They watch back.
            </p>
            <p>Later, you work with one of them. Then lunch. Then you work with another.</p>
            <p>
              You leave when it&apos;s done. A few days later, something the horse did will come back to
              you. That&apos;s the work.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Pull Quote ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-groundwork-dark/90 mb-6">
            &quot;I&apos;ve been trying to explain it to my wife for a week.&quot;
          </blockquote>
          <p className="text-xs font-sans uppercase tracking-[0.15em] text-groundwork-label">
            — Groundwork, Cohort 01
          </p>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-groundwork-border-light" />
      </div>

      {/* ─── The Facilitator ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            The facilitator
          </p>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>
              Groundwork is run by Dawn, founder of Decode Horsemanship in Chapel Hill. Before
              horses, she spent two decades in corporate leadership — running teams, developing
              people, consulting on team dynamics and process at the executive level. She has been
              training, rehabilitating, and partnering with horses for over a decade, including
              mustangs straight off Bureau of Land Management holdings.
            </p>
            <p>
              Her work is grounded in deep horsemanship, not therapy. She is not there to process
              your feelings. She is there to make sure the horses can do their work.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-groundwork-border-light" />
      </div>

      {/* ─── Dates & Pricing ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            Next dates
          </p>

          {/* Placeholder dates */}
          <div className="space-y-3 mb-10 font-sans text-base">
            <p className="text-groundwork-muted">Date TBA — email to be notified</p>
            <p className="text-groundwork-muted">Date TBA — email to be notified</p>
          </div>

          <div className="space-y-2 text-lg md:text-xl leading-relaxed mb-10">
            <p>One day, 8:30 AM to 4:00 PM. Group of 4–6 men. Lunch included.</p>
            <p className="font-medium">$850 per person.</p>
          </div>

          <Link
            href="/groundwork/register"
            className="inline-block font-sans text-sm font-medium px-8 py-3.5 bg-groundwork-dark text-groundwork-cream rounded hover:bg-groundwork-dark/90 transition-colors"
          >
            Reserve a Spot
          </Link>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-groundwork-border-light" />
      </div>

      {/* ─── Questions ───────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-10">
            Questions
          </p>

          <div className="space-y-10">
            <div>
              <p className="text-lg md:text-xl font-serif mb-3">Do I need any horse experience?</p>
              <p className="font-sans text-base text-groundwork-muted">
                No. Everything takes place on the ground. You will not ride. The horses will do the
                work; your job is to show up.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">What should I wear?</p>
              <p className="font-sans text-base text-groundwork-muted">
                Closed-toe shoes (boots or sturdy sneakers). Long pants. Layers for weather. No
                flip-flops or sandals.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">
                Can I bring my wife / partner / friend?
              </p>
              <p className="font-sans text-base text-groundwork-muted">
                No. The day is structured for men only, and group size is capped at 6. If someone in
                your life thinks they&apos;d benefit from something similar, Decode Horsemanship offers
                other programs.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">What if the weather is bad?</p>
              <p className="font-sans text-base text-groundwork-muted">
                We have an indoor round pen and covered areas. The day runs rain or shine. Only
                severe weather (lightning, ice) would trigger a reschedule.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">What&apos;s your cancellation policy?</p>
              <p className="font-sans text-base text-groundwork-muted">
                $200 deposit non-refundable. Balance refundable up to 14 days before the session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-16 px-6 bg-groundwork-dark text-groundwork-cream">
        <div className="max-w-[720px] mx-auto">
          <p className="font-serif text-lg mb-1">Groundwork</p>
          <p className="font-serif italic text-groundwork-cream/60 text-sm mb-6">
            A program of Decode Horsemanship
          </p>

          <div className="font-sans text-sm text-groundwork-cream/70 space-y-2 mb-8">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-groundwork-cream/50" />
              Chapel Hill, North Carolina
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-groundwork-cream/50" />
              <a href="mailto:groundwork@decodehorsemanship.com" className="hover:text-groundwork-cream">
                groundwork@decodehorsemanship.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-groundwork-cream/50" />
              <a href="tel:+19192442647" className="hover:text-groundwork-cream">
                (919) 244-2647
              </a>
            </p>
          </div>

          <div className="h-px bg-groundwork-cream/20 mb-8" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans text-xs text-groundwork-cream/50">
            <a href="https://www.decodehorsemanship.com" className="hover:text-groundwork-cream">
              decodehorsemanship.com
            </a>
            <p>© 2026 Decode Horsemanship LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
