import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Fetch package pricing from database
async function getPackagePricing() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("copper_lace_packages")
    .select("slug, price")
    .eq("active", true);

  const pricing: Record<string, number> = {
    "day-pass": 72500,
    "stay-till-moonrise": 89500,
  };

  if (data) {
    data.forEach((pkg) => {
      pricing[pkg.slug] = pkg.price;
    });
  }

  return pricing;
}

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(0);
}

export const metadata: Metadata = {
  title: "Copper & Lace — A woman's day at Decode Horsemanship",
  description:
    "Horses, thread, fire. No riding required. A full day on a horse farm in Chapel Hill, NC.",
  openGraph: {
    title: "Copper & Lace",
    description: "A woman's day on a horse farm. No riding required.",
    images: [
      {
        url: "/copper-and-lace/og.png",
        width: 1200,
        height: 630,
        alt: "Copper & Lace — Decode Horsemanship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Copper & Lace",
    description: "Horses, thread, fire. A woman's day on a horse farm.",
    images: ["/copper-and-lace/og.png"],
  },
  other: {
    "theme-color": "#0c0a09",
  },
};

/* ============================================
   Copper & Lace Component Library
   ============================================ */

/* Lace divider - scalloped line with dots */
function LaceDivider() {
  return (
    <div className="w-full h-[22px]" aria-hidden="true">
      <svg
        viewBox="0 0 1200 22"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M0,4 Q30,20 60,4 T120,4 T180,4 T240,4 T300,4 T360,4 T420,4 T480,4 T540,4 T600,4 T660,4 T720,4 T780,4 T840,4 T900,4 T960,4 T1020,4 T1080,4 T1140,4 T1200,4"
          fill="none"
          stroke="var(--cl-copper-dim)"
          strokeWidth="1"
        />
        <g fill="var(--cl-copper-dim)">
          <circle cx="30" cy="12" r="1.6" />
          <circle cx="90" cy="12" r="1.6" />
          <circle cx="150" cy="12" r="1.6" />
          <circle cx="210" cy="12" r="1.6" />
          <circle cx="270" cy="12" r="1.6" />
          <circle cx="330" cy="12" r="1.6" />
          <circle cx="390" cy="12" r="1.6" />
          <circle cx="450" cy="12" r="1.6" />
          <circle cx="510" cy="12" r="1.6" />
          <circle cx="570" cy="12" r="1.6" />
          <circle cx="630" cy="12" r="1.6" />
          <circle cx="690" cy="12" r="1.6" />
          <circle cx="750" cy="12" r="1.6" />
          <circle cx="810" cy="12" r="1.6" />
          <circle cx="870" cy="12" r="1.6" />
          <circle cx="930" cy="12" r="1.6" />
          <circle cx="990" cy="12" r="1.6" />
          <circle cx="1050" cy="12" r="1.6" />
          <circle cx="1110" cy="12" r="1.6" />
          <circle cx="1170" cy="12" r="1.6" />
        </g>
      </svg>
    </div>
  );
}

/* Wrap - max-width container */
function Wrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[920px] mx-auto px-7 ${className}`}>{children}</div>
  );
}

/* Eyebrow - small label */
function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-[var(--font-cl-sans)] text-[11px] tracking-[0.28em] uppercase text-[var(--cl-copper-light)] font-medium ${className}`}
    >
      {children}
    </span>
  );
}

/* Section head */
function SectionHead({
  eyebrow,
  heading,
  description,
  className = "",
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-[640px] mb-[52px] ${className}`}>
      {eyebrow && <Eyebrow className="mb-3.5 block">{eyebrow}</Eyebrow>}
      <h2 className="font-[var(--font-cl-serif)] font-medium text-[clamp(32px,4.4vw,46px)] leading-[1.12] text-[var(--cl-ivory)]">
        {heading}
      </h2>
      {description && (
        <p className="mt-[18px] text-[17px] text-[var(--cl-muted)] max-w-[540px]">
          {description}
        </p>
      )}
    </div>
  );
}

/* Timeline row */
function TimelineRow({
  time,
  title,
  description,
}: {
  time: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] max-sm:grid-cols-[70px_1fr] gap-6 py-[26px] border-b border-[var(--cl-hairline)]">
      <div className="font-[var(--font-cl-serif)] text-xl italic text-[var(--cl-copper-light)] pt-0.5">
        {time}
      </div>
      <div>
        <h3 className="font-[var(--font-cl-serif)] font-medium text-[22px] text-[var(--cl-ink)] mb-1.5">
          {title}
        </h3>
        <p className="text-[var(--cl-muted)] text-[15px]">{description}</p>
      </div>
    </div>
  );
}

/* Station block */
function Station({
  number,
  title,
  description,
  highlight,
}: {
  number: string;
  title: string;
  description: string;
  highlight?: string;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr] max-sm:grid-cols-[44px_1fr] gap-[26px] py-10 border-b border-[var(--cl-hairline)] first:border-t">
      <div className="font-[var(--font-cl-serif)] italic text-[15px] text-[var(--cl-copper-dim)] pt-1">
        {number}
      </div>
      <div>
        <h3 className="font-[var(--font-cl-serif)] font-medium text-[26px] text-[var(--cl-ivory)] mb-2.5">
          {title}
        </h3>
        <p className="text-[var(--cl-muted)] text-base max-w-[560px]">
          {description}
          {highlight && (
            <span className="text-[var(--cl-ink)] italic"> {highlight}</span>
          )}
        </p>
      </div>
    </div>
  );
}

/* Evening item */
function EveningItem({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="border-l border-[var(--cl-copper-dim)] pl-[18px]">
      <div className="font-[var(--font-cl-sans)] text-[11px] tracking-[0.2em] uppercase text-[var(--cl-copper-light)] mb-1.5">
        {label}
      </div>
      <p className="text-[var(--cl-ivory)] text-base">{description}</p>
    </div>
  );
}

/* Price card */
function PriceCard({
  eyebrow,
  title,
  price,
  includes,
  fine,
  highlight = false,
}: {
  eyebrow: string;
  title: string;
  price: string;
  includes: string;
  fine: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-[40px_34px] ${highlight ? "bg-[var(--cl-crimson)]" : "bg-[var(--cl-black-soft)]"}`}
    >
      <Eyebrow className={highlight ? "!text-[var(--cl-ivory)]" : ""}>
        {eyebrow}
      </Eyebrow>
      <h3
        className={`font-[var(--font-cl-serif)] italic text-[22px] mb-5 ${highlight ? "text-[var(--cl-ink)]" : "text-[var(--cl-muted)]"}`}
      >
        {title}
      </h3>
      <div
        className={`font-[var(--font-cl-serif)] font-medium text-[52px] mb-1.5 ${highlight ? "text-[var(--cl-ink)]" : "text-[var(--cl-ivory)]"}`}
      >
        <sup className="text-xl relative -top-[1.2em] text-[var(--cl-copper-light)]">
          $
        </sup>
        {price}
      </div>
      <div
        className={`text-sm mb-[22px] ${highlight ? "text-[var(--cl-ink)]" : "text-[var(--cl-muted)]"}`}
      >
        {includes}
      </div>
      <div
        className={`text-xs tracking-[0.04em] uppercase ${highlight ? "text-[rgba(244,239,230,0.65)]" : "text-[var(--cl-copper-dim)]"}`}
      >
        {fine}
      </div>
    </div>
  );
}

/* Info cell */
function InfoCell({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-[var(--cl-black)] p-[28px_26px]">
      <div className="font-[var(--font-cl-sans)] text-[11px] tracking-[0.2em] uppercase text-[var(--cl-copper-light)] mb-2.5">
        {label}
      </div>
      <p className="text-[var(--cl-ivory)] text-[15px]">{text}</p>
    </div>
  );
}

/* Bring list item */
function BringItem({
  children,
  type = "bring",
}: {
  children: React.ReactNode;
  type?: "bring" | "dont";
}) {
  return (
    <li
      className={`text-[15px] py-[9px] border-b border-[var(--cl-hairline)] ${type === "dont" ? "text-[var(--cl-muted)]" : "text-[var(--cl-ivory)]"}`}
    >
      {children}
    </li>
  );
}

/* Button variants */
function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
}) {
  const baseClass =
    "inline-block py-[15px] px-[34px] font-[var(--font-cl-sans)] text-xs tracking-[0.16em] uppercase no-underline rounded-[2px] transition-all duration-[250ms]";
  const variantClass =
    variant === "primary"
      ? "bg-[var(--cl-crimson)] text-[var(--cl-ink)] border border-[var(--cl-crimson)] hover:bg-[var(--cl-crimson-bright)] hover:-translate-y-px"
      : "bg-transparent text-[var(--cl-ivory)] border border-[var(--cl-hairline)] hover:border-[var(--cl-copper-light)] hover:text-[var(--cl-copper-light)]";

  return (
    <Link href={href} className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </Link>
  );
}

export default async function CopperAndLacePage() {
  const pricing = await getPackagePricing();

  return (
    <main
      className="font-[var(--font-cl-sans)] font-light text-[var(--cl-ink)] antialiased leading-relaxed overflow-x-hidden"
      style={{ background: "var(--cl-black)" }}
    >
      {/* ============================================
          Header
          ============================================ */}
      <header className="py-[22px] px-7 flex justify-between items-center font-[var(--font-cl-sans)] text-xs tracking-[0.14em] uppercase text-[var(--cl-muted)]">
        <span>Decode Horsemanship · Chapel Hill, NC</span>
        <a
          href="https://www.decodehorsemanship.com/"
          className="no-underline text-[var(--cl-muted)] hover:text-[var(--cl-copper-light)] transition-colors"
        >
          Main Site
        </a>
      </header>

      {/* ============================================
          Hero
          ============================================ */}
      <section
        className="relative py-[70px_28px_100px] text-center"
        style={{
          background: `radial-gradient(ellipse 900px 500px at 50% -10%, rgba(183,121,63,0.14), transparent 60%), var(--cl-black)`,
        }}
      >
        <Eyebrow className="block mb-[22px]">From sunup to lantern-light</Eyebrow>
        <h1 className="font-[var(--font-cl-serif)] font-medium italic text-[clamp(52px,11vw,108px)] leading-[0.95] tracking-[0.01em] text-[var(--cl-ivory)] mb-[26px]">
          Copper
          <em className="block font-normal not-italic text-[var(--cl-copper-light)]">
            &amp; Lace
          </em>
        </h1>
        <p className="font-[var(--font-cl-serif)] text-[clamp(19px,2.6vw,24px)] italic text-[var(--cl-muted)] max-w-[560px] mx-auto mb-10">
          Horses, thread, fire. No riding required. You&apos;ll show up soft-handed
          and go home with{" "}
          <strong className="text-[var(--cl-ink)] not-italic font-medium">
            calluses under the polish and a braid only you could make.
          </strong>
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-2">
          <Button href="#book">Hold a Spot</Button>
          <Button href="#the-day" variant="ghost">
            See the Day
          </Button>
        </div>
      </section>

      <LaceDivider />

      {/* ============================================
          Intro
          ============================================ */}
      <section id="the-day" className="py-[86px]">
        <Wrap>
          <SectionHead
            eyebrow="A working day, not a spa day"
            heading="Your hands will be busy the whole time."
          />
          <div className="space-y-[18px]">
            <p className="text-lg text-[var(--cl-ivory)] max-w-[640px]">
              You&apos;ll work alongside the horsewoman on whatever the farm asks for
              that day — and learn the skills underneath it.
            </p>
            <p className="text-lg text-[var(--cl-ivory)] max-w-[640px]">
              We don&apos;t put you on a horse. We teach you how to{" "}
              <em className="text-[var(--cl-copper-light)]">read one.</em> How a
              horse decides to trust you before it ever decides to follow you.
              How to stand still and mean it.
            </p>
            <p className="text-lg text-[var(--cl-ivory)] max-w-[640px]">
              Then we put your hands to work somewhere else — the braid, the
              wire, the fire.{" "}
              <em className="text-[var(--cl-copper-light)]">
                Real skill, not a souvenir.
              </em>
            </p>
          </div>
        </Wrap>
      </section>

      <LaceDivider />

      {/* ============================================
          Timeline
          ============================================ */}
      <section className="py-[86px]">
        <Wrap>
          <SectionHead
            eyebrow="The Shape of the Day"
            heading="Sunup to lantern-light."
          />
          <div className="border-t border-[var(--cl-hairline)]">
            <TimelineRow
              time="08:00"
              title="Coffee & brief."
              description="Land, horses, what the day holds."
            />
            <TimelineRow
              time="08:30"
              title="The horse block."
              description="Groom. Tack up. Lead."
            />
            <TimelineRow
              time="10:30"
              title="Whatever needs doing."
              description="Barn, tack, garden — the farm sets the work."
            />
            <TimelineRow
              time="12:00"
              title="Lunch over coals."
              description="Cooked together, eaten at one long table."
            />
            <TimelineRow
              time="01:15"
              title="The lace bench."
              description="Horsehair and copper wire, braided into something you'll wear."
            />
            <TimelineRow
              time="03:00"
              title="Roping the dummy."
              description="A steer head, a hay bale, and a rope. You'll catch more than you miss by the end of it."
            />
            <TimelineRow
              time="04:30"
              title="Day Pass closes."
              description="Or stay on for the lantern."
            />
          </div>
        </Wrap>
      </section>

      {/* ============================================
          Stations
          ============================================ */}
      <section className="py-[86px]">
        <Wrap>
          <SectionHead
            eyebrow="What You'll Actually Do"
            heading="Hard skills. Soft hands. Both stay."
          />
          <div className="flex flex-col">
            <Station
              number="I."
              title="The horse block."
              description="Groom, tack up, and lead — plus a few quiet minutes in the round pen with a horse that decides whether it likes you."
              highlight="No riding, no rushing."
            />
            <Station
              number="II."
              title="Farm work."
              description="Whatever the day sets — stalls, tack cleaning, the kind of upkeep that keeps a farm standing. Not staged for you. Real."
            />
            <Station
              number="III."
              title="Fire-cooked lunch."
              description="You help cook it, and everyone eats at the same table. Sides in cast iron, bread off the fire."
            />
            <Station
              number="IV."
              title="The lace bench."
              description="Horsehair braided the old way, finished with a hand-wrapped copper wire clasp — a technique that's just lace-making with a horse's tail instead of thread."
              highlight="It goes home on your wrist."
            />
            <Station
              number="V."
              title="Roping the dummy."
              description="A steer head, a hay bale, and a rope. No experience needed — just a willingness to miss a few before you don't."
              highlight="Bring your competitive streak."
            />
          </div>
        </Wrap>
      </section>

      {/* ============================================
          Take Home
          ============================================ */}
      <section
        className="border-t border-b border-[var(--cl-hairline)]"
        style={{ background: "var(--cl-black-soft)" }}
      >
        <Wrap className="py-[86px]">
          <p className="font-[var(--font-cl-serif)] text-[clamp(22px,3.2vw,30px)] leading-[1.5] text-[var(--cl-ivory)] max-w-[720px]">
            <em className="text-[var(--cl-copper-light)]">
              A bracelet you braided yourself,
            </em>{" "}
            copper and horsehair twisted by your own hands. The quiet knowledge
            of how a horse follows a woman it trusts. Dirt under your nails that
            won&apos;t come out until tomorrow&apos;s shower.{" "}
            <em className="text-[var(--cl-copper-light)]">
              And the kind of tired that feels like yours.
            </em>
          </p>
        </Wrap>
      </section>

      {/* ============================================
          Two Ways
          ============================================ */}
      <section className="py-[86px]">
        <Wrap>
          <SectionHead eyebrow="Booking" heading="Two ways to do this." />
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-px bg-[var(--cl-hairline)] border border-[var(--cl-hairline)]">
            <div className="bg-[var(--cl-black)] p-[36px_32px]">
              <Eyebrow className="mb-3.5 block">Open Enrollment</Eyebrow>
              <h3 className="font-[var(--font-cl-serif)] font-medium text-2xl text-[var(--cl-ink)] mb-3">
                Come alone or bring a friend.
              </h3>
              <p className="text-[var(--cl-muted)] text-[15px]">
                We&apos;ll seat you with a small group of women for the day.
                Strangers at 8am, usually not by lunch.
              </p>
            </div>
            <div className="bg-[var(--cl-black)] p-[36px_32px]">
              <Eyebrow className="mb-3.5 block">Private Booking</Eyebrow>
              <h3 className="font-[var(--font-cl-serif)] font-medium text-2xl text-[var(--cl-ink)] mb-3">
                Claim the day for your group.
              </h3>
              <p className="text-[var(--cl-muted)] text-[15px]">
                Bring your people — a birthday, a bachelorette, a reunion. Same
                day, same price, just yours.
              </p>
            </div>
          </div>
          <p className="text-center mt-[22px] text-[var(--cl-muted)] text-[13px] tracking-[0.06em] uppercase">
            Same day. Same price. Either way, six women max.
          </p>
        </Wrap>
      </section>

      <LaceDivider />

      {/* ============================================
          Evening
          ============================================ */}
      <section
        className="py-[86px]"
        style={{
          background: `radial-gradient(ellipse 700px 400px at 50% 110%, rgba(143,28,46,0.18), transparent 60%), var(--cl-black)`,
        }}
      >
        <Wrap>
          <SectionHead
            eyebrow="After Dark · Optional"
            heading="Stay till the lantern's out."
            description="Some days end when the work's done. Some end when the last story does. The braids are finished, the Dutch oven goes on as the light drops, and the porch fills up."
          />
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-10 mt-11">
            <EveningItem
              label="Supper"
              description="Dutch oven, slow-cooked, shared off one table."
            />
            <EveningItem
              label="Drink"
              description="Tea, cider, sweet tea, water."
            />
            <EveningItem
              label="Hands"
              description="Mending, embroidery, or just your braid to finish."
            />
            <EveningItem
              label="Talk"
              description="Stories by lantern light. We stay till they run out."
            />
          </div>
        </Wrap>
      </section>

      {/* ============================================
          Pricing
          ============================================ */}
      <section id="book" className="py-[86px]">
        <Wrap>
          <SectionHead eyebrow="Book the Day" heading="Pick a date, lock it in." />
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-px bg-[var(--cl-hairline)] border border-[var(--cl-hairline)]">
            <PriceCard
              eyebrow="Day Pass"
              title="Sunup to four-thirty"
              price={formatPrice(pricing["day-pass"])}
              includes="Lunch included. Bracelet included. Home for dinner."
              fine="Per woman"
            />
            <PriceCard
              eyebrow="Stay Till Moonrise"
              title="Until the last story's told"
              price={formatPrice(pricing["stay-till-moonrise"])}
              includes="Day Pass plus Dutch oven supper, tea, and lantern light."
              fine="Two to six women · Private bookings only"
              highlight
            />
          </div>
        </Wrap>
      </section>

      {/* ============================================
          Info Grid
          ============================================ */}
      <section className="py-[86px]">
        <Wrap>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-px bg-[var(--cl-hairline)] border border-[var(--cl-hairline)] mb-px">
            <InfoCell
              label="Who"
              text="Two to six women per day. No experience necessary."
            />
            <InfoCell
              label="When"
              text="The second Saturday of every month. Severe weather reschedules."
            />
            <InfoCell
              label="Where"
              text="Decode Horsemanship · Chapel Hill, NC."
            />
            <InfoCell
              label="How Long"
              text="Sunup to four-thirty. Or stay till moonrise."
            />
            <InfoCell
              label="Booking"
              text="Open enrollment, or claim the day for your group of 2–6."
            />
            <InfoCell
              label="Wear"
              text="Boots or sturdy shoes. Clothes you don't mind losing to dirt."
            />
          </div>
        </Wrap>
      </section>

      {/* ============================================
          Bring / Don't Bring
          ============================================ */}
      <section className="py-[86px]">
        <Wrap>
          <SectionHead eyebrow="Before You Come" heading="What to bring." />
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[60px] mt-11">
            <div>
              <h4 className="font-[var(--font-cl-serif)] italic font-medium text-[19px] text-[var(--cl-copper-light)] mb-[18px]">
                Bring
              </h4>
              <ul className="list-none">
                <BringItem>Boots or sturdy closed-toe shoes</BringItem>
                <BringItem>Clothes you can get dirt on</BringItem>
                <BringItem>A hat with a brim</BringItem>
                <BringItem>Sunglasses &amp; sunscreen</BringItem>
                <BringItem>A water bottle</BringItem>
                <BringItem>A light layer — mornings are cool</BringItem>
                <BringItem>A change of clothes for the drive home</BringItem>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-cl-serif)] italic font-medium text-[19px] text-[var(--cl-copper-light)] mb-[18px]">
                Don&apos;t Bring
              </h4>
              <ul className="list-none">
                <BringItem type="dont">Open-toed shoes or sandals</BringItem>
                <BringItem type="dont">
                  Anything you&apos;d cry over getting dirty
                </BringItem>
                <BringItem type="dont">Heavy perfume (the horses)</BringItem>
                <BringItem type="dont">
                  Acrylics you&apos;re precious about — the wire work is hands-on
                </BringItem>
                <BringItem type="dont">Anyone you didn&apos;t book</BringItem>
                <BringItem type="dont">An agenda</BringItem>
              </ul>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ============================================
          Final CTA
          ============================================ */}
      <section className="text-center py-[100px_28px_70px]">
        <h2 className="font-[var(--font-cl-serif)] font-medium italic text-[clamp(34px,5vw,50px)] text-[var(--cl-ivory)] mb-5">
          Come make something.
        </h2>
        <p className="text-[var(--cl-muted)] mb-9">
          Pick a date, fill in the details, and lock in your spot.
        </p>
        <Button href="/copper-and-lace/register">See Available Dates</Button>
        <div className="mt-[22px] text-sm text-[var(--cl-muted)]">
          Or text the horsewoman directly:{" "}
          <a
            href="tel:9192442647"
            className="text-[var(--cl-copper-light)] no-underline border-b border-[var(--cl-copper-dim)]"
          >
            (919) 244-2647
          </a>
        </div>
      </section>

      {/* ============================================
          Footer
          ============================================ */}
      <footer className="py-10 px-7 text-center border-t border-[var(--cl-hairline)] text-[var(--cl-muted)] text-xs tracking-[0.04em]">
        <div className="font-[var(--font-cl-serif)] italic text-[var(--cl-copper-light)] text-[15px] mb-2.5">
          Copper &amp; Lace
        </div>
        <div>A Day at Decode Horsemanship · Chapel Hill, NC</div>
        <div className="mt-3.5">
          © {new Date().getFullYear()} Decode Horsemanship. All rights reserved.
        </div>
        <div className="mt-3.5">
          <a
            href="https://www.decodehorsemanship.com/"
            className="no-underline text-[var(--cl-muted)] mx-2.5 hover:text-[var(--cl-copper-light)] transition-colors"
          >
            Main Site
          </a>
          <a
            href="mailto:info@decodehorsemanship.com"
            className="no-underline text-[var(--cl-muted)] mx-2.5 hover:text-[var(--cl-copper-light)] transition-colors"
          >
            Email
          </a>
        </div>
      </footer>
    </main>
  );
}
