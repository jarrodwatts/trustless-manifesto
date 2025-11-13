import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Trustless Manifesto | Sign on Ethereum",
  description: "Every system begins with good intentions. A hosted node here, a whitelisted relayer there. Each is harmless on its own - and together they become habit. Sign the Trustless Manifesto on Ethereum.",
  openGraph: {
    title: "The Trustless Manifesto",
    description: "Sign the Trustless Manifesto on Ethereum",
    images: ["/eth.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
