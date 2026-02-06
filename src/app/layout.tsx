import type { Metadata } from "next";
import localFont from "next/font/local";
import { SavedCardsProvider } from "@/context/SavedCardsContext";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Swype - Compare Crypto & DeFi Cards | blocmates",
  description:
    "Compare crypto debit cards, self-custody cards, and DeFi spending cards side by side. Find the best fees, rewards, and perks for your needs.",
  openGraph: {
    title: "Swype - Compare Crypto & DeFi Cards | blocmates",
    description:
      "Compare crypto debit cards, self-custody cards, and DeFi spending cards side by side.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <SavedCardsProvider>{children}</SavedCardsProvider>
      </body>
    </html>
  );
}
