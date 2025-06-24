import { ProvidersCtxProvider } from "@/ctx";
import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const jet = JetBrains_Mono({
  variable: "--font-jet",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hydra",
  description: "Code Reviewer",
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
        className={`${geistSans.variable} ${geistMono.variable} ${jet.variable} antialiased`}
      >
        <ProvidersCtxProvider>{children}</ProvidersCtxProvider>
      </body>
    </html>
  );
}
