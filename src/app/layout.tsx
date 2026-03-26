import type { Metadata } from "next";
import { Open_Sans, Inter } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hagion Admin Dashboard",
  description: "Hagion International Ltd — Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${inter.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col ${openSans.className}`}>{children}</body>
    </html>
  );
}
