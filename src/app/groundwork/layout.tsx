import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groundwork — A day with horses, for men who want something else.",
  description: "A one-day equine-assisted experience for men at Decode Horsemanship in Chapel Hill, North Carolina.",
  openGraph: {
    title: "Groundwork — A day with horses, for men who want something else.",
    description: "A one-day equine-assisted experience for men at Decode Horsemanship in Chapel Hill, North Carolina.",
    type: "website",
  },
};

export default function GroundworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Groundwork pages have their own visual identity - no shared nav/footer wrapper
  return <>{children}</>;
}
