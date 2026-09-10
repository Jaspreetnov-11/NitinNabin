import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-os",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nitin Nabin — National President, Bharatiya Janata Party",
  description:
    "Official public record and leadership documentation of Nitin Nabin, National President of the Bharatiya Janata Party and Member of the Bihar Legislative Assembly.",
  openGraph: {
    title: "Nitin Nabin — National President, Bharatiya Janata Party",
    description: "Public record and leadership documentation.",
    images: ["https://www.nitinnabin.com/images/hero-bg.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F07A1F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>{children}</body>
    </html>
  );
}
