import type { Metadata } from "next";
import { InquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Dust & Leather — A man's day at Decode Horsemanship",
  description:
    "Horses, fire, leather. No riding required. A full day on a horse farm in Chapel Hill, NC.",
  openGraph: {
    title: "Dust & Leather",
    description: "A man's day on a horse farm. No riding required.",
    images: [
      {
        url: "/dust-and-leather/og.png",
        width: 1200,
        height: 630,
        alt: "Dust & Leather — Decode Horsemanship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dust & Leather",
    description: "Horses, fire, leather. A man's day on a horse farm.",
    images: ["/dust-and-leather/og.png"],
  },
};

/* Styled ampersand component for headlines */
function Amp({ mode = "anchor" }: { mode?: "anchor" | "daylight" | "evening" }) {
  const color = mode === "daylight" ? "text-field" : "text-sage";
  return (
    <span className={`font-voice italic ${color}`}>&amp;</span>
  );
}

/* Emphasized text - IM Fell English Italic */
function Em({
  children,
  mode = "daylight",
}: {
  children: React.ReactNode;
  mode?: "daylight" | "dark";
}) {
  const color = mode === "daylight" ? "text-field" : "text-sage";
  return (
    <em className={`font-voice italic not-italic ${color}`}>{children}</em>
  );
}

/* Section wrapper with grain overlay */
function Section({
  children,
  mode,
  className = "",
  id,
}: {
  children: React.ReactNode;
  mode: "anchor" | "daylight" | "evening";
  className?: string;
  id?: string;
}) {
  const bgClass =
    mode === "anchor"
      ? "bg-char"
      : mode === "evening"
        ? "bg-soot"
        : "bg-paper";
  const grainClass = mode === "daylight" ? "on-light" : "on-dark";

  return (
    <section id={id} className={`grain ${grainClass} ${bgClass} ${className}`}>
      {children}
    </section>
  );
}

/* Container for content max-width */
function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[1150px] mx-auto px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/* Eyebrow label */
function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono-old uppercase tracking-[0.35em] text-xs sm:text-sm ${className}`}
    >
      {children}
    </p>
  );
}

/* Schedule item */
function ScheduleItem({
  time,
  title,
  description,
  isLast = false,
}: {
  time: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`py-3 ${!isLast ? "border-b border-dashed border-tobacco/30" : ""}`}
    >
      <div className="flex gap-4 sm:gap-5">
        <span className="font-mono-old text-tobacco text-base sm:text-lg w-14 sm:w-16 shrink-0">
          {time}
        </span>
        <div>
          <p className="font-body font-semibold text-ink text-lg sm:text-xl">
            {title}
          </p>
          <p className="font-voice italic text-tobacco text-base sm:text-lg mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* Skill card */
function SkillCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="pb-5 border-b border-dashed border-tobacco/30">
      <span className="font-numerals text-tobacco text-base">{number}</span>
      <h3 className="font-display text-ink text-xl sm:text-2xl mt-1.5 mb-1.5">
        {title}
      </h3>
      <p className="font-body text-ink text-lg leading-snug">
        {description}
      </p>
    </div>
  );
}

/* Fine print item */
function FinePrintItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5">
      <dt className="font-mono-old uppercase tracking-[0.25em] text-tobacco text-sm w-20 shrink-0">
        {label}
      </dt>
      <dd className="font-body text-ink text-lg mt-1 sm:mt-0">{value}</dd>
    </div>
  );
}

/* Packing list item */
function PackingItem({
  children,
  type = "bring",
}: {
  children: React.ReactNode;
  type?: "bring" | "dont";
}) {
  const bulletColor = type === "bring" ? "bg-field" : "bg-tobacco";
  return (
    <li className="flex items-start gap-3 py-1">
      <span
        className={`w-1.5 h-1.5 rounded-full ${bulletColor} mt-2.5 shrink-0`}
      />
      <span className="font-body text-ink text-lg">{children}</span>
    </li>
  );
}

/* Evening list item */
function EveningListItem({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="py-2">
      <span className="font-mono-old uppercase tracking-[0.25em] text-sage text-sm">
        {label}
      </span>
      <span className="font-body text-bone text-lg ml-4">{description}</span>
    </div>
  );
}

/* Pricing card */
function PricingCard({
  label,
  price,
  description,
}: {
  label: string;
  price: string;
  description: string;
}) {
  return (
    <div className="border-t border-hearth pt-5">
      <Eyebrow className="text-tobacco">{label}</Eyebrow>
      <p className="font-display text-bone text-4xl sm:text-5xl mt-2">{price}</p>
      <p className="font-voice italic text-dust text-lg mt-1.5">{description}</p>
    </div>
  );
}

/* Ember dot with pulsing glow */
function EmberDot() {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full bg-ember animate-ember-pulse"
      aria-hidden="true"
    />
  );
}

export default function DustAndLeatherPage() {
  return (
    <main className="font-body text-ink antialiased">
      {/* ============================================
          1. Brand Band (Anchor mode)
          ============================================ */}
      <Section mode="anchor" className="py-3">
        <Container>
          <p className="font-mono-old uppercase tracking-[0.4em] text-sage text-[10px] sm:text-xs text-center">
            Decode Horsemanship &nbsp;·&nbsp; Chapel Hill, NC
          </p>
        </Container>
      </Section>

      {/* ============================================
          2. Hero (Anchor mode)
          ============================================ */}
      <Section mode="anchor" className="py-20 sm:py-32">
        <Container className="text-center">
          {/* Headline */}
          <h1 className="font-display text-bone text-5xl sm:text-7xl md:text-8xl tracking-wide opacity-0 animate-[fade-in_0.6s_ease-out_0.1s_forwards]">
            Dust <Amp mode="anchor" /> Leather
          </h1>

          {/* Subtitle */}
          <p className="font-voice italic text-dust text-xl sm:text-2xl mt-4 opacity-0 animate-[fade-in_0.6s_ease-out_0.3s_forwards]">
            Horses, fire, leather.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-8 opacity-0 animate-[fade-in_0.6s_ease-out_0.5s_forwards]">
            <span className="w-2 h-2 rounded-full bg-sage/60" />
            <span className="w-20 h-px bg-sage/40" />
            <span className="w-2 h-2 rounded-full bg-sage/60" />
          </div>

          {/* Pitch */}
          <p className="font-body text-bone text-xl sm:text-2xl leading-snug max-w-[48ch] mx-auto opacity-0 animate-[fade-in_0.6s_ease-out_0.7s_forwards]">
            No riding. No roping cattle. Just real farm work, real skills, and
            real food cooked over a real fire. You&apos;ll show up clean and go
            home with <Em mode="dark">dust on your jeans and a belt you cut yourself.</Em>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 opacity-0 animate-[fade-in_0.6s_ease-out_0.9s_forwards]">
            <a
              href="#booking"
              className="inline-block font-mono-old uppercase tracking-[0.3em] text-sm bg-field hover:bg-field-deep text-bone px-8 py-4 transition-colors"
            >
              Hold a Spot
            </a>
            <a
              href="#the-day"
              className="inline-block font-mono-old uppercase tracking-[0.3em] text-sm border border-tobacco text-bone hover:bg-tobacco/20 px-8 py-4 transition-colors"
            >
              See the Day
            </a>
          </div>
        </Container>
      </Section>

      {/* ============================================
          3. The Day (Daylight mode)
          ============================================ */}
      <Section mode="daylight" id="the-day" className="py-20 sm:py-28">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left column - description */}
            <div>
              <Eyebrow className="text-tobacco mb-4">From sunup</Eyebrow>
              <h2 className="font-display text-ink text-3xl sm:text-4xl mb-6">
                A working day, not a tour.
              </h2>
              <p className="font-voice italic text-field text-xl sm:text-2xl mb-5">
                You&apos;ll work alongside the horseman on whatever needs doing — and
                learn the skills that make it possible.
              </p>
              <p className="font-body text-ink text-lg sm:text-xl leading-snug mb-3">
                We don&apos;t put you on a horse. We teach you how to{" "}
                <Em>read one.</Em> How to load it. How to tack it. How to walk
                into a round pen and have it follow you across the dirt with no
                rope at all.
              </p>
              <p className="font-body text-ink text-lg sm:text-xl leading-snug">
                Then we put you to work. Posts, fence, a round bale that needs
                moving without a tractor. Real work, with real callouses to show
                for it.
              </p>
            </div>

            {/* Right column - schedule */}
            <div className="border-l-2 border-field pl-6 sm:pl-8">
              <ScheduleItem
                time="08:00"
                title="Coffee & brief."
                description="Land, history, what the day looks like."
              />
              <ScheduleItem
                time="08:30"
                title="The horse block."
                description="Handle. Load. Saddle. Lead at liberty."
              />
              <ScheduleItem
                time="11:00"
                title="Whatever needs doing."
                description="Posts, fence, hay — the farm sets the work."
              />
              <ScheduleItem
                time="12:15"
                title="Lunch over coals."
                description="Steaks, beans, bread. You cook it."
              />
              <ScheduleItem
                time="01:30"
                title="The leather bench."
                description="Cut and stitch a belt that's yours."
              />
              <ScheduleItem
                time="03:00"
                title="Rope & axe."
                description="Dummy steer. Targets. A little competition."
              />
              <ScheduleItem
                time="04:30"
                title="Day Pass closes."
                description="Or stay on for the fire."
                isLast
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================
          4. The Skills (Daylight mode)
          ============================================ */}
      <Section mode="daylight" className="py-16 sm:py-24">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            <SkillCard
              number="01"
              title="The horse block."
              description="Handling, trailer loading, saddling, and a few minutes alone in the round pen with a horse that decides whether it likes you."
            />
            <SkillCard
              number="02"
              title="Farm work."
              description="Whatever needs doing the day you come — fence, posts, hay, the kind of work the farm sets, not us."
            />
            <SkillCard
              number="03"
              title="Fire-cooked lunch."
              description="You grill your own steak over coals. Sides in cast iron. Bread off the fire. You'll learn how to read meat by feel."
            />
            <SkillCard
              number="04"
              title="The leather bench."
              description="Cut, punch, stitch, and finish a real leather belt with the horseman who taught a hundred others to do the same. It goes home with you."
            />
            <SkillCard
              number="05"
              title="Roping the dummy."
              description="A steer head, a hay bale, and a rope. By the end of the afternoon you'll catch more than you miss."
            />
            <SkillCard
              number="06"
              title="Axe throwing."
              description="Targets, a few rules, and a little friendly competition. No experience needed. Bring your shoulders."
            />
          </div>
        </Container>
      </Section>

      {/* ============================================
          5. Quiet Sell (Daylight mode)
          ============================================ */}
      <Section mode="daylight" className="py-16 sm:py-24">
        <Container className="text-center">
          <div className="max-w-[50ch] mx-auto">
            <h2 className="font-display text-ink text-2xl sm:text-3xl mb-5">
              What you&apos;ll take home.
            </h2>
            <p className="font-body text-ink text-xl sm:text-2xl leading-snug">
              A belt you cut and stamped yourself. The quiet knowledge of how a
              horse follows a man it trusts. Dust on your jeans that won&apos;t come
              out in the wash.{" "}
              <Em>And the kind of tired that feels earned.</Em>
            </p>
          </div>
        </Container>
      </Section>

      {/* ============================================
          6. Evening — Stay for the Fire (Evening mode)
          ============================================ */}
      <Section mode="evening" id="fire" className="py-20 sm:py-28">
        <Container>
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <EmberDot />
              <Eyebrow className="text-sage">
                After dark <span className="text-sage/60">·</span> Optional
              </Eyebrow>
            </div>
            <h2 className="font-display text-bone text-3xl sm:text-4xl mb-4">
              Stay for the fire.
            </h2>
            <p className="font-voice italic text-sage text-xl sm:text-2xl">
              Some days end when the work&apos;s done. Some end when the cards do.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left column - description */}
            <div>
              <p className="font-body text-bone text-lg sm:text-xl leading-snug mb-3">
                The work&apos;s done. The belts are stitched. The fire&apos;s already going
                from lunch and the Dutch oven goes on as the light drops.
              </p>
              <p className="font-body text-bone text-lg sm:text-xl leading-snug">
                Cobbler. Cigars. Whiskey by the bottle. Cards by lantern light.{" "}
                <Em mode="dark">
                  We play until somebody runs out of chips or somebody runs out
                  of stories.
                </Em>
              </p>
            </div>

            {/* Right column - what's on the table */}
            <div className="border-l-2 border-field pl-6 sm:pl-8">
              <EveningListItem label="SUPPER" description="Dutch oven, slow-cooked." />
              <EveningListItem
                label="DRINK"
                description="Whiskey. Beer. Coffee if you want it."
              />
              <EveningListItem label="SMOKE" description="Cigars by the fire." />
              <EveningListItem label="CARDS" description="Poker until they're done." />
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================
          7. Pricing (Evening mode, continues)
          ============================================ */}
      <Section mode="evening" className="py-16 sm:py-24">
        <Container>
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 max-w-3xl mx-auto">
            <PricingCard
              label="Day Pass · From sunup to four-thirty"
              price="$725"
              description="Lunch included. Belt included. Home for dinner."
            />
            <PricingCard
              label="Stay for the Fire · Until the cards are done"
              price="$895"
              description="Day Pass plus Dutch oven supper, whiskey, and cards."
            />
          </div>
          <p className="font-voice italic text-dust text-lg text-center mt-8">
            2 to 4 men per day. Private bookings only.
          </p>
        </Container>
      </Section>

      {/* ============================================
          8. The Fine Print (Daylight mode)
          ============================================ */}
      <Section mode="daylight" className="py-16 sm:py-24">
        <Container>
          <dl className="max-w-2xl mx-auto divide-y divide-tobacco/20">
            <FinePrintItem
              label="WHO"
              value="Men, 2 to 4 at a time. No experience necessary."
            />
            <FinePrintItem
              label="WHEN"
              value="Saturdays, by appointment. Spring through fall."
            />
            <FinePrintItem
              label="WHERE"
              value="Decode Horsemanship · Chapel Hill, NC."
            />
            <FinePrintItem
              label="WEAR"
              value="Boots or sturdy shoes. Long pants. A hat if you've got one."
            />
            <FinePrintItem label="BRING" value="Yourself. We've got the rest." />
          </dl>
        </Container>
      </Section>

      {/* ============================================
          9. Packing List (Daylight mode)
          ============================================ */}
      <Section mode="daylight" className="py-16 sm:py-24">
        <Container>
          <div className="grid sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {/* Bring column */}
            <div className="border-l-2 border-field pl-6">
              <Eyebrow className="text-tobacco mb-4">Bring</Eyebrow>
              <ul className="space-y-1">
                <PackingItem type="bring">Boots or sturdy work shoes</PackingItem>
                <PackingItem type="bring">Long pants (jeans, work pants)</PackingItem>
                <PackingItem type="bring">A hat with a brim</PackingItem>
                <PackingItem type="bring">Sunglasses</PackingItem>
                <PackingItem type="bring">Sunscreen</PackingItem>
                <PackingItem type="bring">A water bottle</PackingItem>
                <PackingItem type="bring">Layers — mornings are cool</PackingItem>
                <PackingItem type="bring">
                  A change of clothes for the drive home
                </PackingItem>
              </ul>
            </div>

            {/* Don't Bring column */}
            <div className="border-l-2 border-tobacco pl-6">
              <Eyebrow className="text-tobacco mb-4">Don&apos;t Bring</Eyebrow>
              <ul className="space-y-1">
                <PackingItem type="dont">Open-toed shoes</PackingItem>
                <PackingItem type="dont">Shorts</PackingItem>
                <PackingItem type="dont">Cologne (the horses)</PackingItem>
                <PackingItem type="dont">
                  A camera you&apos;re afraid to scuff
                </PackingItem>
                <PackingItem type="dont">Anyone you didn&apos;t book</PackingItem>
                <PackingItem type="dont">
                  Anything you&apos;d hate to get dust on
                </PackingItem>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================
          10. The Booking Section (Anchor mode)
          ============================================ */}
      <Section mode="anchor" id="booking" className="py-20 sm:py-28">
        <Container className="text-center">
          <div className="max-w-xl mx-auto">
            <Eyebrow className="text-sage mb-4">Hold a spot</Eyebrow>
            <h2 className="font-display text-bone text-3xl sm:text-4xl mb-4">
              Book the day.
            </h2>
            <p className="font-voice italic text-dust text-xl sm:text-2xl mb-8">
              Tell us when you&apos;re free and how many of you. We&apos;ll write back.
            </p>

            <InquiryForm />

            <p className="font-voice italic text-dust text-base mt-6">
              Or text the horseman directly: (919) 244-2647
            </p>
          </div>
        </Container>
      </Section>

      {/* ============================================
          11. Footer (Anchor mode)
          ============================================ */}
      <Section mode="anchor" className="py-12 sm:py-16">
        <Container className="text-center">
          <p className="font-display text-bone text-xl sm:text-2xl mb-4">
            Decode Horsemanship
          </p>
          <p className="font-mono-old uppercase tracking-[0.3em] text-sage text-[10px] sm:text-xs mb-6">
            Dust <Amp mode="anchor" /> Leather &nbsp;·&nbsp; A Day at Decode
            Horsemanship &nbsp;·&nbsp; Chapel Hill, NC
          </p>
          <p className="font-body text-tobacco text-base">
            © {new Date().getFullYear()} Decode Horsemanship. All rights
            reserved.
          </p>
          <div className="flex justify-center gap-6 mt-5">
            <a
              href="/"
              className="font-body text-sage hover:text-bone text-base transition-colors underline-offset-4 hover:underline"
            >
              Main Site
            </a>
            <a
              href="mailto:info@decodehorsemanship.com"
              className="font-body text-sage hover:text-bone text-base transition-colors underline-offset-4 hover:underline"
            >
              Email
            </a>
            {/* TODO: Add Instagram link if available */}
          </div>
        </Container>
      </Section>
    </main>
  );
}

/*
  TODO: Image placeholders needed in /public/dust-and-leather/
  - og-image.png (1200x630) - Open Graph image

  Note: This page uses no images in the body content by design.
  Add hero/section images as needed by updating this file.
*/
