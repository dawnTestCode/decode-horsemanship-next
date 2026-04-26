import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | Decode Horsemanship EAL",
    default: "Equine Assisted Learning | Decode Horsemanship",
  },
  description: "Transformative experiences through partnership with horses. Corporate programs, personal development, and youth programs in Chapel Hill, NC.",
  openGraph: {
    title: "Equine Assisted Learning | Decode Horsemanship",
    description: "Transformative experiences through partnership with horses. Corporate programs, personal development, and youth programs in Chapel Hill, NC.",
    type: "website",
    siteName: "Decode Horsemanship",
    images: [
      {
        url: "https://www.decodehorsemanship.com/eal-og.png",
        width: 1200,
        height: 630,
        alt: "Equine Assisted Learning at Decode Horsemanship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equine Assisted Learning | Decode Horsemanship",
    description: "Transformative experiences through partnership with horses. Corporate programs, personal development, and youth programs in Chapel Hill, NC.",
    images: ["https://www.decodehorsemanship.com/eal-og.png"],
  },
};

export default function EALLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
