import { Cormorant_Garamond, Jost } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cl-serif",
  display: "swap",
});

const jost = Jost({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cl-sans",
  display: "swap",
});

export default function CopperAndLaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${cormorantGaramond.variable} ${jost.variable}`}>
      {children}
    </div>
  );
}
