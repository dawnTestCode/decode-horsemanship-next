import Link from "next/link";

/* Styled ampersand component for headlines */
function Amp() {
  return <span className="font-[var(--font-cl-serif)] italic text-[var(--cl-copper-light)]">&amp;</span>;
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
      className={`font-[var(--font-cl-sans)] uppercase tracking-[0.35em] text-xs sm:text-sm ${className}`}
    >
      {children}
    </p>
  );
}

export default function CopperAndLaceSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  return (
    <main
      className="font-[var(--font-cl-sans)] text-[var(--cl-ink)] antialiased min-h-screen flex flex-col"
      style={{ background: "var(--cl-black)" }}
    >
      {/* Brand Band */}
      <section className="py-3">
        <Container>
          <p className="font-[var(--font-cl-sans)] uppercase tracking-[0.4em] text-[var(--cl-muted)] text-[10px] sm:text-xs text-center">
            Decode Horsemanship &nbsp;·&nbsp; Chapel Hill, NC
          </p>
        </Container>
      </section>

      {/* Success Content */}
      <section className="flex-1 flex items-center py-20 sm:py-32">
        <Container className="text-center">
          <Eyebrow className="text-[var(--cl-copper-light)] mb-6">Confirmed</Eyebrow>

          <h1 className="font-[var(--font-cl-serif)] font-medium text-[var(--cl-ivory)] text-4xl sm:text-5xl md:text-6xl tracking-wide mb-4">
            You&apos;re in.
          </h1>

          <p className="font-[var(--font-cl-serif)] italic text-[var(--cl-muted)] text-xl sm:text-2xl mb-8">
            The day is yours.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-8">
            <span className="w-2 h-2 rounded-full bg-[var(--cl-copper-light)]/60" />
            <span className="w-20 h-px bg-[var(--cl-copper-light)]/40" />
            <span className="w-2 h-2 rounded-full bg-[var(--cl-copper-light)]/60" />
          </div>

          <div className="max-w-lg mx-auto space-y-6">
            <p className="font-[var(--font-cl-sans)] text-[var(--cl-ivory)] text-xl leading-relaxed">
              Check your email for confirmation details. The horsewoman will reach
              out within 48 hours to lock down the date.
            </p>

            <div className="border border-[var(--cl-copper-dim)]/30 p-6" style={{ background: "var(--cl-black-soft)" }}>
              <p className="font-[var(--font-cl-sans)] uppercase tracking-[0.3em] text-[var(--cl-copper-light)] text-sm mb-3">
                What to expect
              </p>
              <ul className="font-[var(--font-cl-sans)] text-[var(--cl-muted)] text-base space-y-2 text-left">
                <li>• Confirmation email with details</li>
                <li>• Call or text to coordinate the date</li>
                <li>• Packing list and directions before your day</li>
              </ul>
            </div>

            <p className="font-[var(--font-cl-serif)] italic text-[var(--cl-muted)] text-base">
              Questions? Text the horsewoman: (919) 244-2647
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/copper-and-lace"
              className="inline-block font-[var(--font-cl-sans)] uppercase tracking-[0.3em] text-sm border border-[var(--cl-copper-dim)] text-[var(--cl-ivory)] hover:bg-[var(--cl-copper-dim)]/20 px-8 py-4 transition-colors"
            >
              Back to Copper <Amp /> Lace
            </Link>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <section className="py-8">
        <Container className="text-center">
          <p className="font-[var(--font-cl-sans)] uppercase tracking-[0.3em] text-[var(--cl-muted)]/60 text-[10px]">
            Copper <Amp /> Lace · Decode Horsemanship · Chapel Hill, NC
          </p>
        </Container>
      </section>
    </main>
  );
}
