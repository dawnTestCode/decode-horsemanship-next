import type { Metadata } from "next";
import LessonsLayout from "@/components/layout/LessonsLayout";

export const metadata: Metadata = {
  title: "Lessons — Private Natural Horsemanship Instruction",
  description: "Private, one-on-one lessons in natural horsemanship. Not a one-day event. Ongoing instruction, built around wherever you actually are.",
  openGraph: {
    title: "Lessons — Private Natural Horsemanship Instruction",
    description: "Private, one-on-one lessons in natural horsemanship. Not a one-day event. Ongoing instruction, built around wherever you actually are.",
    type: "website",
    siteName: "Decode Horsemanship",
  },
};

export default function LessonsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LessonsLayout>{children}</LessonsLayout>;
}
