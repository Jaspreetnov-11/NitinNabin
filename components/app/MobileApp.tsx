"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang, SiteContent } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import { buzz, IconConnect, IconFeed, IconGallery, IconHome, IconJourney, readLocal, writeLocal, type Ctx } from "./shared";
import HomeTab from "./HomeTab";
import JourneyTab from "./JourneyTab";
import FeedTab from "./FeedTab";
import GalleryTab from "./GalleryTab";
import ConnectTab from "./ConnectTab";
import StoryViewer from "./StoryViewer";

type Tab = "home" | "journey" | "feed" | "gallery" | "connect";
const TABS: { id: Tab; icon: () => React.ReactNode; en: string; hi: string }[] = [
  { id: "home", icon: () => <IconHome />, en: "Home", hi: "होम" },
  { id: "journey", icon: () => <IconJourney />, en: "Journey", hi: "यात्रा" },
  { id: "feed", icon: () => <IconFeed />, en: "Feed", hi: "फ़ीड" },
  { id: "gallery", icon: () => <IconGallery />, en: "Photos", hi: "चित्र" },
  { id: "connect", icon: () => <IconConnect />, en: "Connect", hi: "संपर्क" },
];

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };

export default function MobileApp({ content }: { content: SiteContent }) {
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<Tab>("home");
  const [splash, setSplash] = useState(true);
  const [story, setStory] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const panes = useRef<Partial<Record<Tab, HTMLDivElement | null>>>({});

  const t = STRINGS[lang];
  const L = useCallback(<T,>(en: T, hi: T) => (lang === "hi" ? hi : en), [lang]);
  const ctx: Ctx = { content, lang, t, L };

  // restore prefs, hash deep-link, splash, PWA plumbing
  useEffect(() => {
    setLang(readLocal<Lang>("nn-app-lang", "en"));
    setSeen(new Set(readLocal<string[]>("nn-app-seen", [])));
    const h = location.hash.slice(1) as Tab;
    if (TABS.some((x) => x.id === h)) setTab(h);

    let quick = false;
    try {
      quick = sessionStorage.getItem("nn-app-splash") === "1";
      sessionStorage.setItem("nn-app-splash", "1");
    } catch {}
    const tm = setTimeout(() => setSplash(false), quick ? 250 : 1900);

    setStandalone(window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/app-sw.js", { scope: "/app" }).catch(() => {});
    }
    return () => {
      clearTimeout(tm);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    writeLocal("nn-app-lang", lang);
  }, [lang]);

  const markSeen = useCallback((id: string) => {
    setSeen((cur) => {
      if (cur.has(id)) return cur;
      const next = new Set(cur).add(id);
      writeLocal("nn-app-seen", [...next]);
      return next;
    });
  }, []);

  const go = (next: Tab) => {
    buzz();
    if (next === tab) {
      panes.current[next]?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTab(next);
    history.replaceState(null, "", next === "home" ? "/app" : `/app#${next}`);
    setScrolled((panes.current[next]?.scrollTop ?? 0) > 8);
  };

  const doInstall = async () => {
    if (!install) return;
    await install.prompt();
    setInstall(null);
  };

  const idx = TABS.findIndex((x) => x.id === tab);

  const pane = (id: Tab, node: React.ReactNode) => (
    <div
      key={id}
      ref={(el) => { panes.current[id] = el; }}
      className={`ma-pane${tab === id ? " on" : ""}`}
      hidden={tab !== id}
      onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}
    >
      <div className="ma-inner">{node}</div>
    </div>
  );

  return (
    <div className="ma-stage">
      <aside className="ma-side" aria-hidden="true">
        <b>{t.name}</b>
        <p>{lang === "hi" ? "मोबाइल ऐप — फ़ोन पर खोलें और होम स्क्रीन पर जोड़ें।" : "The mobile app — open it on your phone and add it to your home screen."}</p>
        <code>/app</code>
      </aside>

      <div className="ma-phone">
        {splash && (
          <div className="ma-splash" aria-hidden="true">
            <div className="burst" />
            <div className="mono">NN</div>
            <b>{t.name}</b>
            <small>{t.role_short}</small>
          </div>
        )}

        <header className={`ma-top${scrolled ? " s" : ""}`}>
          <div className="brand">
            <span className="mono">NN</span>
            <div><b>{t.name}</b><small>{t.role_short}</small></div>
          </div>
          <button className="ma-lang" onClick={() => { buzz(); setLang(lang === "en" ? "hi" : "en"); }} aria-label={lang === "en" ? "हिन्दी में बदलें" : "Switch to English"}>
            <span className={lang === "en" ? "on" : undefined}>EN</span>
            <span className={lang === "hi" ? "on" : undefined}>हिं</span>
          </button>
        </header>

        <main className="ma-main">
          {pane("home", <HomeTab ctx={ctx} seen={seen} openStory={setStory} goto={go} />)}
          {pane("journey", <JourneyTab ctx={ctx} />)}
          {pane("feed", <FeedTab ctx={ctx} />)}
          {pane("gallery", <GalleryTab ctx={ctx} />)}
          {pane("connect", <ConnectTab ctx={ctx} canInstall={!!install} onInstall={doInstall} standalone={standalone} />)}
        </main>

        <nav className="ma-nav" aria-label="App" style={{ "--i": idx } as React.CSSProperties}>
          <span className="blob" aria-hidden="true" />
          {TABS.map((x) => (
            <button key={x.id} className={tab === x.id ? "on" : undefined} onClick={() => go(x.id)} aria-current={tab === x.id ? "page" : undefined}>
              {x.icon()}
              <span>{L(x.en, x.hi)}</span>
            </button>
          ))}
        </nav>

        {story !== null && <StoryViewer ctx={ctx} start={story} onClose={() => setStory(null)} onSeen={markSeen} />}
      </div>
    </div>
  );
}
