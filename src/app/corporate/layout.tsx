import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Corporate Programs — Team development with horses",
  description: "Leadership workshops, team building, and organizational development. Horses respond to the real you—not your title.",
  openGraph: {
    title: "Corporate Programs — Team development with horses",
    description: "Leadership workshops, team building, and organizational development. Horses respond to the real you—not your title.",
    type: "website",
    siteName: "Decode Horsemanship",
  },
};

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
