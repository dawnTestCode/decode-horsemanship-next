import {
  Rye,
  IM_Fell_English,
  Cormorant_Garamond,
  Special_Elite,
  Old_Standard_TT,
} from "next/font/google";

const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const imFellEnglish = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-voice",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono-old",
  display: "swap",
});

const oldStandardTT = Old_Standard_TT({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-numerals",
  display: "swap",
});

export default function DustAndLeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${rye.variable} ${imFellEnglish.variable} ${cormorantGaramond.variable} ${specialElite.variable} ${oldStandardTT.variable}`}
    >
      {children}
    </div>
  );
}
