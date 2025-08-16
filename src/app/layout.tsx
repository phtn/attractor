import { ProvidersCtxProvider } from "@/ctx";
import type { Metadata } from "next";
import {
  Fira_Mono,
  Geist,
  Geist_Mono,
  Oxanium,
  Space_Grotesk,
} from "next/font/google";
import { type ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jet = Fira_Mono({
  variable: "--font-jet",
  weight: ["400"],
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const ox = Oxanium({
  variable: "--font-ox",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "re-up.ph",
  description: "Secure Cloud Systems",
  icons: ["/re-up-icon-v3.svg"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${ox.variable} ${geistSans.variable} ${geistMono.variable} ${jet.variable} ${space.variable} antialiased`}
      >
        <ProvidersCtxProvider>{children}</ProvidersCtxProvider>
      </body>
    </html>
  );
}
