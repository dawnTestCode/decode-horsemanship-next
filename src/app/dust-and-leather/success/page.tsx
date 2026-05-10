import Link from "next/link";

/* Styled ampersand component for headlines */
function Amp() {
  return <span className="font-voice italic text-sage">&amp;</span>;
}

/* Section wrapper with grain overlay */
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`grain on-dark bg-char ${className}`}>
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

export default function DustAndLeatherSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  return (
    <main className="font-body text-ink antialiased min-h-screen flex flex-col">
      {/* Brand Band */}
      <Section className="py-3">
        <Container>
          <p className="font-mono-old uppercase tracking-[0.4em] text-sage text-[10px] sm:text-xs text-center">
            Decode Horsemanship &nbsp;·&nbsp; Chapel Hill, NC
          </p>
        </Container>
      </Section>

      {/* Success Content */}
      <Section className="flex-1 flex items-center py-20 sm:py-32">
        <Container className="text-center">
          <Eyebrow className="text-sage mb-6">Confirmed</Eyebrow>

          <h1 className="font-display text-bone text-4xl sm:text-5xl md:text-6xl tracking-wide mb-4">
            You&apos;re in.
          </h1>

          <p className="font-voice italic text-dust text-xl sm:text-2xl mb-8">
            The day is yours.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-8">
            <span className="w-2 h-2 rounded-full bg-sage/60" />
            <span className="w-20 h-px bg-sage/40" />
            <span className="w-2 h-2 rounded-full bg-sage/60" />
          </div>

          <div className="max-w-lg mx-auto space-y-6">
            <p className="font-body text-bone text-xl leading-relaxed">
              Check your email for confirmation details. The horseman will reach
              out within 48 hours to lock down the date.
            </p>

            <div className="bg-char border border-tobacco/30 p-6">
              <p className="font-mono-old uppercase tracking-[0.3em] text-sage text-sm mb-3">
                What to expect
              </p>
              <ul className="font-body text-dust text-base space-y-2 text-left">
                <li>• Confirmation email with details</li>
                <li>• Call or text to coordinate the date</li>
                <li>• Packing list and directions before your day</li>
              </ul>
            </div>

            <p className="font-voice italic text-dust text-base">
              Questions? Text the horseman: (919) 244-2647
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/dust-and-leather"
              className="inline-block font-mono-old uppercase tracking-[0.3em] text-sm border border-tobacco text-bone hover:bg-tobacco/20 px-8 py-4 transition-colors"
            >
              Back to Dust <Amp /> Leather
            </Link>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Section className="py-8">
        <Container className="text-center">
          <p className="font-mono-old uppercase tracking-[0.3em] text-sage/60 text-[10px]">
            Dust <Amp /> Leather · Decode Horsemanship · Chapel Hill, NC
          </p>
        </Container>
      </Section>
    </main>
  );
}
