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
    images: ["https://decodehorsemanship.com/eal-og.png"],
  },
};

export default function EALLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
