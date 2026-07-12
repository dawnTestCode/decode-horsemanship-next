import Link from 'next/link';
import { ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { UpcomingSessions } from './UpcomingSessions';
import { createClient } from '@supabase/supabase-js';

// Fetch pricing from database
async function getPricing() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from('programs')
    .select('full_price, price_label')
    .eq('slug', 'groundwork')
    .single();

  return {
    fullPrice: data?.full_price || 47500,
    priceLabel: data?.price_label || '$475',
  };
}

export default async function GroundworkPage() {
  const pricing = await getPricing();
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
            A half-day for men
          </p>
          <p className="text-xl md:text-2xl font-serif italic text-groundwork-cream/90">
            No talking circle. No trust falls. No one&apos;s going to ask how that made you feel.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-groundwork-cream/50">
          <span className="text-xs font-sans uppercase tracking-[0.15em]">continue</span>
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* ─── The Short Version ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            The short version
          </p>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>Four hours. A horse that doesn&apos;t care about your job title. That&apos;s the whole pitch.</p>
            <p>A half-day at a working horse farm in Chapel Hill, North Carolina.</p>
            <p>Small group of men. One to four horses. Coffee at the start, lunch at the end.</p>
            <p>Nothing in between is a workshop. Nothing is a metaphor someone&apos;s going to explain to you afterward.</p>
          </div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-groundwork-border-light" />
      </div>

      {/* ─── This Is For You If ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            This is for you if
          </p>
          <div className="space-y-4 font-sans text-base md:text-lg text-groundwork-dark/90">
            <p>— You&apos;ve outgrown the bar, the golf, the usual.</p>
            <p>— You&apos;re good at your job and don&apos;t know what to do with a Saturday that isn&apos;t more of it.</p>
            <p>— Nothing&apos;s wrong, exactly. You&apos;re just tired of &quot;fine.&quot;</p>
            <p>— You wouldn&apos;t tell your buddies you&apos;re doing this. You&apos;re doing it anyway.</p>
          </div>
        </div>
      </section>

      {/* ─── How It Goes ─────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-groundwork-dark text-groundwork-cream">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-cream/60 mb-8">
            How it goes
          </p>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>
              You show up, get coffee, and stand at the fence for a while. Nobody hands you an icebreaker.
              You just watch the horse figure out what kind of morning this is.
            </p>
            <p>
              Then you go in. One horse, no rope, no script — just you working out how to get 1,200 pounds
              of animal to move because it wants to, not because you made it. Most guys find this harder
              than it sounds and easier than they expected, in that order.
            </p>
            <p>
              Lunch closes it out. You can talk about what happened. Nobody&apos;s going to make you.
            </p>
            <p>
              You&apos;re back in your truck by early afternoon. What actually landed usually shows up a few
              days later — in traffic, at work, wherever you weren&apos;t expecting it.
            </p>
          </div>
        </div>
      </section>

      {/* ─── The Horses ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            The horses
          </p>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>
              Some of these horses came straight off Bureau of Land Management holding pens — wild,
              never handled, no idea yet what a calm human even is. They don&apos;t perform for you.
              They don&apos;t care what you drive or what you do for a living.
            </p>
            <p>
              They react to whatever&apos;s actually standing in front of them. If you&apos;re impatient,
              you&apos;ll find out fast. If you&apos;re steady, you&apos;ll find that out too.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-groundwork-border-light" />
      </div>

      {/* ─── No One Will ─────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            No one will
          </p>
          <div className="space-y-4 font-sans text-base md:text-lg text-groundwork-dark/90">
            <p>— Ask you to share your feelings.</p>
            <p>— Call this &quot;self-care.&quot;</p>
            <p>— Treat you like something&apos;s broken.</p>
            <p>— Care whether you cry, or whether you don&apos;t.</p>
            <p>— Ask if you&apos;re &quot;ready.&quot; Just show up.</p>
          </div>
        </div>
      </section>

      {/* ─── Pull Quote ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-groundwork-dark text-groundwork-cream">
        <div className="max-w-[720px] mx-auto text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-groundwork-cream/90 mb-6">
            &quot;I&apos;ve been trying to explain it to my wife for a week.&quot;
          </blockquote>
          <p className="text-xs font-sans uppercase tracking-[0.15em] text-groundwork-cream/60">
            — Groundwork, Cohort 01
          </p>
        </div>
      </section>

      {/* ─── Who Runs It ─────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            Who runs it
          </p>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>
              Dawn — founder of Decode Horsemanship. Before horses, she spent two decades in corporate
              leadership: running teams, developing people, consulting on team dynamics at the executive
              level. She&apos;s been training and rehabilitating horses for over a decade, including mustangs
              straight off BLM holdings.
            </p>
            <p>
              Her work is grounded in deep horsemanship, not therapy. She&apos;s not there to process your
              feelings. She&apos;s there to make sure the horses can do theirs.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-groundwork-border-light" />
      </div>

      {/* ─── The Details ─────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            The details
          </p>

          <UpcomingSessions />

          <div className="space-y-3 text-lg md:text-xl leading-relaxed mb-10 font-sans">
            <p><span className="font-medium">When</span> — Second Saturday of the month. 8:30 AM – 12:30 PM.</p>
            <p><span className="font-medium">Where</span> — Decode Horsemanship, Chapel Hill, NC. Directions sent on booking.</p>
            <p><span className="font-medium">Group size</span> — 4–6 men.</p>
            <p><span className="font-medium">What to bring</span> — Closed-toe shoes (boots or sturdy sneakers). Long pants. Layers for weather.</p>
            <p><span className="font-medium">Lunch</span> — Included. Real food, not a granola bar.</p>
            <p><span className="font-medium">What it costs</span> — {pricing.priceLabel}.</p>
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

      {/* ─── Other Programs ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-groundwork-label mb-8">
            Other programs at Decode
          </p>
          <div className="space-y-4 font-sans text-base md:text-lg">
            <p>
              <Link href="/no-reins" className="text-groundwork-dark hover:text-groundwork-dark/70 underline underline-offset-4 transition-colors">
                No Reins
              </Link>
              <span className="text-groundwork-muted"> — A half-day for women, third Saturday of the month.</span>
            </p>
            <p>
              <Link href="/dust-and-leather" className="text-groundwork-dark hover:text-groundwork-dark/70 underline underline-offset-4 transition-colors">
                Dust &amp; Leather
              </Link>
              <span className="text-groundwork-muted"> — A full working ranch day for men, first Saturday of the month.</span>
            </p>
            <p>
              <Link href="/mustang" className="text-groundwork-dark hover:text-groundwork-dark/70 underline underline-offset-4 transition-colors">
                Mustang Immersion
              </Link>
              <span className="text-groundwork-muted"> — Three days with a mustang, a few times a year.</span>
            </p>
          </div>
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
                No. Everything happens on the ground. You will not ride. The horses do the work;
                your job is to show up.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">What should I wear?</p>
              <p className="font-sans text-base text-groundwork-muted">
                Closed-toe shoes, long pants, layers for weather. No flip-flops or sandals.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">
                Can I bring my wife / partner / friend?
              </p>
              <p className="font-sans text-base text-groundwork-muted">
                No. The morning is structured for men only, capped at 6. If someone in your life
                would benefit from something similar, No Reins runs the same experience for women.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">What if the weather is bad?</p>
              <p className="font-sans text-base text-groundwork-muted">
                We have an indoor round pen and covered areas. The morning runs rain or shine. Only
                severe weather (lightning, ice) triggers a reschedule.
              </p>
            </div>

            <div>
              <p className="text-lg md:text-xl font-serif mb-3">What&apos;s your cancellation policy?</p>
              <p className="font-sans text-base text-groundwork-muted">
                Full refund up to 14 days before. Within 14 days, credit toward a future session.
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
