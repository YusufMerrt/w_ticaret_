import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "H&G Butik | Tesettür Giyim",
    template: "%s | H&G Butik",
  },
  description:
    "H&G Butik — Şık ve modern tesettür giyim koleksiyonu. Elbise, ferace, tunik, eşarp ve daha fazlası. Ücretsiz kargo ile kapınızda.",
  keywords: [
    "tesettür giyim",
    "tesettür elbise",
    "ferace",
    "tunik",
    "eşarp",
    "hijab",
    "modest fashion",
    "H&G Butik",
  ],
  openGraph: {
    title: "H&G Butik | Tesettür Giyim",
    description: "Şık ve modern tesettür giyim koleksiyonu",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
