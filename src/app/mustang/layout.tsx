import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Mustang Immersion — Three days with a wild horse",
  description: "Work directly with a BLM mustang learning to trust humans. Witness transformation—theirs and yours.",
  openGraph: {
    title: "Mustang Immersion — Three days with a wild horse",
    description: "Work directly with a BLM mustang learning to trust humans. Witness transformation—theirs and yours.",
    type: "website",
    siteName: "Decode Horsemanship",
  },
};

export default function MustangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
