// Shared bits for the /app mobile experience: context type, icons, small hooks.
import { useEffect, useRef, useState } from "react";
import type { Lang, SiteContent } from "@/lib/types";
import type { Strings } from "@/lib/i18n";

export const IMG = "https://www.nitinnabin.com/images";
export const PORTRAIT = `${IMG}/portrait-cutout.png`;
export const PRESIDENT_SINCE = "2026-01-20";

export type Ctx = {
  content: SiteContent;
  lang: Lang;
  t: Strings;
  L: <T>(en: T, hi: T) => T;
};

/** Short vibration on supporting phones; silently ignored elsewhere. */
export function buzz(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {}
}

/** Animates 0 → target once the element scrolls into view. */
export function useCountUp(target: number, ms = 1400) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / ms);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, ms]);
  return [ref, val] as const;
}

/** Whole days since `iso` (client only; null during SSR to avoid hydration mismatch). */
export function useDaysSince(iso: string) {
  const [d, setD] = useState<number | null>(null);
  useEffect(() => {
    const start = new Date(`${iso}T00:00:00+05:30`).getTime();
    setD(Math.max(1, Math.floor((Date.now() - start) / 86400000) + 1));
  }, [iso]);
  return d;
}

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

type IconProps = { size?: number };
const svg = (d: React.ReactNode) =>
  function Icon({ size = 22 }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
      </svg>
    );
  };

export const IconHome = svg(<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />);
export const IconJourney = svg(<><path d="M4 19c4 0 4-6 8-6s4-6 8-6" /><circle cx="4" cy="19" r="2" /><circle cx="20" cy="7" r="2" /></>);
export const IconFeed = svg(<><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h5" /></>);
export const IconGallery = svg(<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 15l5-5 4 4 3-3 6 6" /><circle cx="16" cy="9" r="1.5" /></>);
export const IconConnect = svg(<><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></>);
export const IconHeart = ({ size = 22, filled = false }: IconProps & { filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7.2 4 4 7.3 4c2 0 3.4 1.1 4.7 2.8C13.3 5.1 14.7 4 16.7 4 20 4 22.4 7.2 21.2 10.6 19.5 15.4 12 20 12 20z" />
  </svg>
);
export const IconShare = svg(<><path d="M12 3v12" /><path d="M7 8l5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></>);
export const IconClose = svg(<path d="M6 6l12 12M18 6L6 18" />);
export const IconArrow = svg(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IconDownload = svg(<><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>);
export const IconPin = svg(<><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>);

export const BRAND: Record<"fb" | "x" | "ig" | "yt", { color: string; path: React.ReactNode }> = {
  fb: {
    color: "#1877F2",
    path: <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  },
  x: {
    color: "#0F1419",
    path: <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
  },
  ig: {
    color: "#E1306C",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </g>
    ),
  },
  yt: {
    color: "#FF0000",
    path: <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
};

export function BrandIcon({ p, size = 18 }: { p: keyof typeof BRAND; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ color: BRAND[p].color }} aria-hidden="true">
      {BRAND[p].path}
    </svg>
  );
}

export const SOCIAL_LINKS: { p: keyof typeof BRAND; url: string; handle: string }[] = [
  { p: "x", url: "https://x.com/NitinNabin", handle: "@NitinNabin" },
  { p: "fb", url: "https://www.facebook.com/NitinNabinBJP/", handle: "NitinNabinBJP" },
  { p: "ig", url: "https://www.instagram.com/nitinnabinbjp/", handle: "@nitinnabinbjp" },
  { p: "yt", url: "https://www.youtube.com/@BJP4India", handle: "@BJP4India" },
];
