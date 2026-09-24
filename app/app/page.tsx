import type { Metadata, Viewport } from "next";
import MobileApp from "@/components/app/MobileApp";
import { getSiteContent } from "@/lib/data";
import "./app.css";

// Same content source and refresh cadence as the homepage.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nitin Nabin — App",
  description: "Stories, journey, live social feed and photos of Nitin Nabin, National President, Bharatiya Janata Party — in an installable mobile app.",
  manifest: "/app.webmanifest",
  appleWebApp: { capable: true, title: "Nitin Nabin", statusBarStyle: "black-translucent" },
  icons: { icon: "/app-icon.svg", apple: "/app-icon-180.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F07A1F",
};

export default async function AppPage() {
  const content = await getSiteContent();
  return <MobileApp content={content} />;
}
