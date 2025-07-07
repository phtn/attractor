import { ProvidersCtxProvider } from "@/ctx";
import type { Metadata } from "next";
import { Fira_Mono, Geist, Geist_Mono, Space_Mono } from "next/font/google";
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
const space = Space_Mono({
  variable: "--font-space",
  weight: ["400"],
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jet.variable} ${space.variable} antialiased`}
      >
        <ProvidersCtxProvider>{children}</ProvidersCtxProvider>
      </body>
    </html>
  );
}
