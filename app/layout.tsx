import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const instrument = Hanken_Grotesk({ variable: "--font-instrument", subsets: ["latin"] });
const fraunces = Instrument_Serif({ variable: "--font-fraunces", subsets: ["latin"], weight: "400" });
const plexMono = JetBrains_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Pulse — Customer Intelligence Dashboard",
  description:
    "RFM segmentation, cohort retention, and churn-risk analysis over two years of real e-commerce transaction data (UCI Online Retail II).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
