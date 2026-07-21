import type { Metadata } from "next";
import KidsLessonsLayout from "@/components/layout/KidsLessonsLayout";

export const metadata: Metadata = {
  title: "Kids & Family Lessons — Ages 5–15 | Decode Horsemanship",
  description: "Kids and family lessons in natural horsemanship. Real responsibility, real animals, real confidence — whether they're leading their first pony or riding independently. Ages 5–15.",
  openGraph: {
    title: "Kids & Family Lessons — Ages 5–15 | Decode Horsemanship",
    description: "Kids and family lessons in natural horsemanship. Real responsibility, real animals, real confidence — whether they're leading their first pony or riding independently. Ages 5–15.",
    type: "website",
    siteName: "Decode Horsemanship",
    images: ["/og-image-kids-lessons.png"],
  },
};

export default function KidsLessonsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KidsLessonsLayout>{children}</KidsLessonsLayout>;
}
