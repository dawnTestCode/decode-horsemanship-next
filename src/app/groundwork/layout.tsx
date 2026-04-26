import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groundwork — A day with horses, for men who want something else.",
  description: "A one-day equine-assisted experience for men at Decode Horsemanship in Chapel Hill, North Carolina.",
  openGraph: {
    title: "Groundwork — A day with horses, for men who want something else.",
    description: "A one-day equine-assisted experience for men at Decode Horsemanship in Chapel Hill, North Carolina.",
    type: "website",
    siteName: "Decode Horsemanship",
    images: [
      {
        url: "https://www.decodehorsemanship.com/og-groundwork.png",
        width: 1200,
        height: 630,
        alt: "Groundwork — A day with horses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Groundwork — A day with horses, for men who want something else.",
    description: "A one-day equine-assisted experience for men at Decode Horsemanship in Chapel Hill, North Carolina.",
    images: ["https://www.decodehorsemanship.com/og-groundwork.png"],
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
