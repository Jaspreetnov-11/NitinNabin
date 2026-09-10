import type { Metadata, Viewport } from "next";
import "./globals.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Archivo:wght@400;500;600&family=Anek+Devanagari:wght@300..800&display=swap";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONTS} rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
