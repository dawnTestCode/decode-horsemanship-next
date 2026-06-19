import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "About — Decode Horsemanship",
  description: "Learn about the people and philosophy behind Decode Horsemanship.",
  openGraph: {
    title: "About — Decode Horsemanship",
    description: "Learn about the people and philosophy behind Decode Horsemanship.",
    type: "website",
    siteName: "Decode Horsemanship",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
