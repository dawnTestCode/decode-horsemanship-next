import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "No Reins — A Half-Day Retreat for Women",
  description: "No costume. No one to perform for. Just you, and a horse who can't be fooled.",
  openGraph: {
    title: "No Reins — A Half-Day Retreat for Women",
    description: "No costume. No one to perform for. Just you, and a horse who can't be fooled.",
    type: "website",
    siteName: "Decode Horsemanship",
    images: [
      {
        url: "https://www.decodehorsemanship.com/no-reins/no-reins-og.png",
        width: 1200,
        height: 630,
        alt: "No Reins — A half-day retreat for women at Decode Horsemanship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "No Reins — A Half-Day Retreat for Women",
    description: "No costume. No one to perform for. Just you, and a horse who can't be fooled.",
    images: ["https://www.decodehorsemanship.com/no-reins/no-reins-og.png"],
  },
};

export default function NoReinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
