"use client";

import { useEffect, useRef, useState, type MouseEvent, type TouchEvent, type PointerEvent, type WheelEvent } from "react";
import type { Lang, Platform, SocialTab, SocialPost, SiteContent } from "@/lib/types";
import { STRINGS, PLATFORMS } from "@/lib/i18n";
import { fmtDate } from "@/lib/format";
import ContactForm from "./ContactForm";

const IMG = "https://www.nitinnabin.com/images";
const NAV_IDS = ["home", "journey", "updates", "media", "contact"];

/** "05 Assembly terms" → ["05", "Assembly terms"]; no leading number → ["", text] */
function splitStat(s: string): [string, string] {
  const m = s.match(/^(\d{2,4})\s*(.*)$/);
  return m ? [m[1], m[2]] : ["", s];
}

export default function Site({ content }: { content: SiteContent }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = STRINGS[lang];
  const L = <T,>(en: T, hi: T) => (lang === "hi" ? hi : en);

  // journey
  const [jIdx, setJIdx] = useState(Math.max(0, content.milestones.length - 1));
  const yearsRef = useRef<HTMLDivElement>(null);
  const j = content.milestones[jIdx];

  // social
  const [soc, setSoc] = useState<SocialTab>("all");
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(content.social);
  const [curIdx, setCurIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const feedTrackRef = useRef<HTMLDivElement>(null);

  // Sync client with /api/social on mount to ensure fresh live feeds
  useEffect(() => {
    fetch("/api/social")
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.social) && d.social.length > 0) {
          setSocialPosts(d.social);
        }
      })
      .catch(() => {});
  }, []);

  const posts = soc === "all" ? socialPosts : socialPosts.filter((p) => p.platform === soc);
  const n = posts.length;
  const tabProf = t.social[soc];

  const pauseInteraction = () => {
    setIsInteracting(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 4000); // 4s idle resumes auto-scroll
  };

  // 2-second auto-scroll interval (smoothly advances track by 1 card)
  useEffect(() => {
    if (isHovered || isInteracting || n <= 1) return;
    const timer = setInterval(() => {
      const el = feedTrackRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>(".soc-post-card");
      const step = (card?.offsetWidth ?? 320) + 16;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 15) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [isHovered, isInteracting, soc, n]);

  const slide = (d: number) => {
    pauseInteraction();
    const el = feedTrackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".soc-post-card");
    const step = ((card?.offsetWidth ?? 320) + 16) * d;
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  const handleTabChange = (k: SocialTab) => {
    pauseInteraction();
    setSoc(k);
    setCurIdx(0);
    if (feedTrackRef.current) {
      feedTrackRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const onFeedScroll = () => {
    const el = feedTrackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".soc-post-card");
    const step = (card?.offsetWidth ?? 320) + 16;
    const idx = Math.round(el.scrollLeft / step);
    setCurIdx(Math.min(n - 1, Math.max(0, idx)));
  };

  // mobile "tap to open" / "show more" state (CSS only applies it below 768px)
  const [bioOpen, setBioOpen] = useState(false);
  const [posOpen, setPosOpen] = useState(false);
  const [jOpen, setJOpen] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => (e: MouseEvent) => {
    if (window.innerWidth >= 768 || (e.target as HTMLElement).closest("a")) return;
    setOpen((o) => ({ ...o, [key]: !o[key] }));
  };

  // bottom nav
  const [active, setActive] = useState("home");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Keep the selected year pill centred inside its own strip (scrolls the strip only, never the page).
  const jMounted = useRef(false);
  useEffect(() => {
    if (!jMounted.current) { jMounted.current = true; return; }
    const ys = yearsRef.current;
    const sel = ys?.children[jIdx] as HTMLElement | undefined;
    if (ys && sel) ys.scrollTo({ left: sel.offsetLeft - ys.clientWidth / 2 + sel.offsetWidth / 2, behavior: "smooth" });
  }, [jIdx]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -50% 0px" }
    );
    NAV_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    pauseInteraction();
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = touchStartY.current !== null ? e.changedTouches[0].clientY - touchStartY.current : 0;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      slide(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Pointer drag support for desktop/laptop
  const ptrStartX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    ptrStartX.current = e.clientX;
    isDragging.current = true;
    pauseInteraction();
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging.current || ptrStartX.current === null) return;
    const dx = e.clientX - ptrStartX.current;
    if (Math.abs(dx) > 35) {
      slide(dx < 0 ? 1 : -1);
    }
    ptrStartX.current = null;
    isDragging.current = false;
  };

  // Mouse wheel / trackpad horizontal scroll support
  const lastWheel = useRef<number>(0);
  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 250) return;
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (Math.abs(dx) > 20) {
      lastWheel.current = now;
      slide(dx > 0 ? 1 : -1);
    }
  };

  const ticker = content.updates.map((u) => `${fmtDate(u.event_date, lang)} — ${L(u.title_en, u.title_hi)}`);

  const artCards = (dup: number) =>
    content.updates.map((u) => (
      <a className="c" href="#updates" key={`${dup}-${u.id}`}>
        {u.image_url && <img src={u.image_url} alt="" loading="lazy" />}
        <div className="b">
          <div className="t">{L(u.kind_en, u.kind_hi)} · {fmtDate(u.event_date, lang)}</div>
          <h3>{L(u.title_en, u.title_hi)}</h3>
          <p>{L(u.summary_en, u.summary_hi)}</p>
          <small>{L(u.place_en, u.place_hi)}</small>
        </div>
      </a>
    ));

  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="b" href="#home"><span>{t.name}</span><small>{t.role_short}</small></a>
          <ul>
            <li><a href="#about">{t.n_about}</a></li><li><a href="#journey">{t.n_journey}</a></li><li><a href="#work">{t.n_work}</a></li>
            <li><a href="#updates">{t.n_updates}</a></li><li><a href="#media">{t.n_media}</a></li><li><a href="#contact">{t.n_contact}</a></li>
          </ul>
          <div className="l" role="group" aria-label="Language">
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "hi" ? "on" : ""} onClick={() => setLang("hi")}>हिं</button>
          </div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="wrap">
          <div className="txt">
            <div className="r"><span className="r1">{t.role_1}</span><span className="r2">{t.role_2}</span></div>
            <h1><span>{t.first}</span><span>{t.last}</span></h1>
            <p>{t.hero_p}</p>
            <div className="acts">
              <a className="btn" href="#journey">{t.cta1}<span aria-hidden="true">→</span></a>
              <a className="btn o" href="#updates">{t.cta2}</a>
            </div>
          </div>
          <div className="por"><img src={`${IMG}/portrait-cutout.png`} alt="Nitin Nabin, official portrait" /></div>
        </div>
      </section>

      <div className="tick" aria-hidden="true">
        <div>{[...ticker, ...ticker].map((s, i) => <span key={i}>{s}</span>)}</div>
      </div>

      <section className="stats">
        <div className="wrap">
          {t.stats.map((s) => (
            <div className="stat-card" key={s[1]}>
              <div className="disp">{s[0]}</div>
              <small>
                {s[1]}
                <em>{s[2]}</em>
              </small>
            </div>
          ))}
        </div>
      </section>

      <section className="intro" id="about">
        <div className="wrap">
          <div className="l">
            <div className="eb">{t.about_eb}</div>
            <h2>{t.about_h[0]}<em>{t.about_h[1]}</em></h2>
            <a className="more" href="#journey">{t.bio_more}</a>
            <div className="facts">{t.facts.map((f) => <div key={f[0]}><small>{f[0]}</small>{f[1]}</div>)}</div>
          </div>
          <div className={`col${bioOpen ? " open" : ""}`}>
            <p className="big">{t.bio[0]}</p>
            <p className="sm">{t.bio[3]}</p>
            <div className="cx"><p className="sm">{t.bio[1]}</p><p className="sm">{t.bio[2]}</p></div>
            <button className={`more-btn${bioOpen ? " open" : ""}`} onClick={() => setBioOpen((v) => !v)}>
              <span className="b">{t.read_more}</span><span className="a">{t.show_less}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="jr" id="journey">
        <div className="wrap">
          <div className="head">
            <div><h2>{t.jr_h}</h2><p className="lead">{t.jr_p}</p></div>
            <div className="jnav">
              <button onClick={() => setJIdx((i) => i - 1)} disabled={jIdx === 0}>←</button>
              <button onClick={() => setJIdx((i) => i + 1)} disabled={jIdx >= content.milestones.length - 1}>→</button>
            </div>
          </div>
          <div className="years" role="tablist" ref={yearsRef}>
            {content.milestones.map((m, i) => (
              <button key={m.id} className="yr" role="tab" aria-selected={i === jIdx} onClick={() => setJIdx(i)}>
                <small>{L(m.kind_en, m.kind_hi)}</small>{m.year}
              </button>
            ))}
          </div>
          {j && (
            <article className={`jcard${jOpen ? " open" : ""}`} aria-live="polite" onClick={(e) => { if (window.innerWidth < 768 && !(e.target as HTMLElement).closest("a")) setJOpen((v) => !v); }}>
              <div><div className="yy">{j.year}</div><div className="k">{L(j.kind_en, j.kind_hi)}</div></div>
              <div>
                <h3>{L(j.title_en, j.title_hi)}</h3>
                <div className="w">{L(j.place_en, j.place_hi)}</div>
                <p>{L(j.body_en, j.body_hi)}</p>
                <div className="rec"><b>{t.record}</b> {L(j.record_en, j.record_hi)}</div>
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="four" id="work">
        <div className="wrap">
          <div className="fh">
            <div>
              <div className="eb">{t.four_eb}</div>
              <h2>{t.four_h[0]} <em>{t.four_h[1]}</em><br />{t.four_h[2]}</h2>
            </div>
            <p className="lead">{t.four_p}</p>
          </div>
          <div className="panel">
            <div className="wm">04</div>
            <div className="rings" />
            <div className="por"><img src={`${IMG}/portrait-cutout.png`} alt="" loading="lazy" /></div>
            <div className="cards">
              {t.four.map((f, i) => {
                const [num, label] = splitStat(f[3]);
                return (
                  <article key={f[1]} className={open[`four${i}`] ? "open" : undefined} onClick={toggle(`four${i}`)}>
                    <span className="ar">↗</span>
                    <div className="tg">{f[0]}</div>
                    <h3>{f[1]}</h3>
                    <p>{f[2]}</p>
                    <div className="ft"><b>{num}</b><span>{label}</span></div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="nl">
        <div className="wrap">
          <h2>{t.nl_h}</h2>
          <div className="grid">
            {t.nl.map((x, i) => (
              <article key={x[0]} className={`col${open[`nl${i}`] ? " open" : ""}`} onClick={toggle(`nl${i}`)}>
                <span className="tg">{x[0]}</span><h3>{x[1]}</h3><div className="yrs">{x[2]}</div><p>{x[3]}</p>
              </article>
            ))}
          </div>
          <div className="rec">
            <div className="h"><h3>{t.rec_h}</h3><p>{t.rec_p}</p></div>
            <div className="tlx">{t.recl.map((r) => <div key={r[0]} data-y={r[0]}>{r[1]}</div>)}</div>
          </div>
        </div>
      </section>

      <section className="pos">
        <div className="wrap">
          <h2>{t.pos_h}</h2>
          <p className="lead">{t.pos_p}</p>
          <ol className={posOpen ? "open" : undefined}>
            {t.pos.map((p, i, a) => {
              const last = i === a.length - 1;
              return (
                <li key={p[0] + p[1]} className={last ? "now" : undefined}>
                  <span className="d">{p[0]}</span>
                  <span>{last ? <b>{p[1]}</b> : <span className="ti">{p[1]}</span>}<span className="o">{p[2]}</span></span>
                </li>
              );
            })}
          </ol>
          <button className={`more-btn${posOpen ? " open" : ""}`} onClick={() => setPosOpen((v) => !v)}>
            <span className="b">{t.show_pos}</span><span className="a">{t.show_less}</span>
          </button>
        </div>
      </section>

      <section className="art" id="updates">
        <div className="head">
          <div><h2>{t.upd_h}</h2><p className="lead" style={{ marginTop: 4 }}>{t.art_p}</p></div>
        </div>
        <div className="track">{artCards(0)}{artCards(1)}</div>
      </section>

      <section className="gal" id="media">
        <div className="wrap">
          <h2>{t.gal_h}</h2>
          <div className="grid">
            {content.gallery.map((g) => (
              <a key={g.id} href={g.image_url} target="_blank" rel="noopener">
                <img src={g.image_url} alt={L(g.caption_en, g.caption_hi)} loading="lazy" />
                <span>{L(g.caption_en, g.caption_hi)}<small>{L(g.sub_en, g.sub_hi)}</small></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="social">
        <div className="wrap">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h2>{t.soc_h}</h2>
            <div className="live-pill">
              <span className="live-dot" />
              <span>{lang === "hi" ? "लाइव सोशल फ़ीड" : "Live Social Feed"}</span>
            </div>
          </div>
          <div className="tabs" role="tablist">
            {PLATFORMS.map((k) => (
              <button
                key={k}
                className="tab"
                role="tab"
                aria-selected={k === soc}
                onClick={() => handleTabChange(k)}
              >
                {t.social[k].label}
              </button>
            ))}
          </div>
          <div
            className="feed"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="who">
              <img src={`${IMG}/portrait-cutout.png`} alt="Nitin Nabin" />
              <div>
                <b>
                  {soc === "all" ? t.name : tabProf.who}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </b>
                <small>
                  {soc === "all" ? (lang === "hi" ? "आधिकारिक सोशल मीडिया हैंडल · रियल टाइम" : "Official Social Media · Live Synced") : tabProf.sub}
                </small>
              </div>
              <a
                href={soc === "all" ? "https://www.facebook.com/NitinNabinBJP/" : tabProf.url}
                target="_blank"
                rel="noopener"
              >
                {soc === "all" ? (lang === "hi" ? "फॉलो करें ↗" : "Follow ↗") : tabProf.btn}
              </a>
            </div>

            <div className="feed-track-wrap">
              <div
                className="feed-track"
                ref={feedTrackRef}
                onScroll={onFeedScroll}
                onTouchStart={pauseInteraction}
                onPointerDown={pauseInteraction}
                onWheel={pauseInteraction}
              >
                {posts.map((p) => {
                  const pHandle =
                    p.platform === "fb" ? "@NitinNabinBJP" :
                    p.platform === "x" ? "@NitinNabin" :
                    p.platform === "ig" ? "@nitinnabinbjp" : "@BJP4India";

                  const isVideo = p.platform === "yt" || p.id.includes("temple");

                  return (
                    <a
                      key={p.id}
                      href={p.post_url ?? "#"}
                      target="_blank"
                      rel="noopener"
                      className="soc-post-card"
                      onClick={() => pauseInteraction()}
                    >
                      <div className="soc-card-head">
                        <img src={`${IMG}/portrait-cutout.png`} alt="" className="soc-card-avatar" />
                        <div className="soc-card-user">
                          <div className="soc-card-name-row">
                            <b>Nitin Nabin</b>
                            <span className="soc-verified-badge" title="Verified">
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="#1877F2">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            </span>
                          </div>
                          <div className="soc-card-sub">
                            <span>{pHandle}</span>
                            <span className="soc-dot">·</span>
                            <span>{L(p.when_en, p.when_hi)}</span>
                          </div>
                        </div>
                        <div className={`soc-platform-icon soc-icon-${p.platform}`} title={t.social[p.platform].label}>
                          {p.platform === "fb" && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          )}
                          {p.platform === "x" && (
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="#0F1419">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          )}
                          {p.platform === "ig" && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          )}
                          {p.platform === "yt" && (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF0000">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {p.image_url && (
                        <div className="soc-media-wrap">
                          <img src={p.image_url} alt="" loading="lazy" className="soc-media-img" />
                          {isVideo && (
                            <div className="soc-video-badge">
                              <span className="soc-play-icon">▶</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="soc-body">
                        <p className="soc-text">{L(p.text_en, p.text_hi)}</p>
                        <div className="soc-meta-tag">
                          <b>{L(p.label_en, p.label_hi)}</b>
                        </div>
                      </div>

                      <div className="soc-foot">
                        <span className="soc-stats">{p.stats}</span>
                        <span className="soc-post-link">
                          {p.platform === "yt"
                            ? (lang === "hi" ? "वीडियो देखें ▶" : "Watch ▶")
                            : (lang === "hi" ? "पोस्ट देखें ↗" : "View Post ↗")}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="pg">
              <div className="bt">
                <button onClick={() => slide(-1)} aria-label="prev">‹</button>
                <button onClick={() => slide(1)} aria-label="next">›</button>
              </div>
              <span>{n ? t.post_of(curIdx + 1, n) : ""}</span>
              <a
                href={soc === "all" ? "https://www.facebook.com/NitinNabinBJP/" : tabProf.url}
                target="_blank"
                rel="noopener"
              >
                {t.view_on} {tabProf.label} ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ct" id="contact">
        <div className="box">
          <h2>{t.ct_h}</h2>
          <p>{t.ct_p}</p>
          <div className="row">
            <a href="https://x.com/NitinNabin" target="_blank" rel="noopener">X</a>
            <a href="https://www.instagram.com/nitinnabinbjp/" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.facebook.com/NitinNabinBJP/" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.youtube.com/@BJP4India" target="_blank" rel="noopener">YouTube</a>
          </div>
          <ContactForm lang={lang} />
          <img src={`${IMG}/portrait-cutout.png`} alt="" loading="lazy" />
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div><div className="n">{t.name}</div><div>{t.role}</div></div>
          <div>
            <h4>{t.f_sections}</h4>
            <ul>
              <li><a href="#about">{t.n_about}</a></li><li><a href="#journey">{t.n_journey}</a></li><li><a href="#work">{t.n_work}</a></li>
              <li><a href="#media">{t.n_media}</a></li><li><a href="#updates">{t.n_updates}</a></li><li><a href="#contact">{t.n_contact}</a></li>
            </ul>
          </div>
          <div className="src">
            <h4>{t.f_sources}</h4>
            <ul>
              <li><a href="https://www.bjp.org/shri-nitin-nabin">bjp.org — official profile</a></li>
              <li><a href="https://prsindia.org/mlatrack/nitin-nabin">PRS Legislative Research</a></li>
              <li><a href="https://ddnews.gov.in/en/nitin-nabin-takes-charge-as-bjp-national-president/">DD News</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Nitin_Nabin">Wikipedia</a></li>
            </ul>
          </div>
          <div><h4>{t.f_policy}</h4><p>{t.f_policy1}</p></div>
          <div className="legal">
            <span>{t.f_copy}</span>
            <span><a href="/app">{lang === "hi" ? "मोबाइल ऐप" : "Mobile app"}</a><a href="#">{t.f_a11y}</a><a href="#">{t.f_privacy}</a><a href="#">{t.f_corr}</a></span>
          </div>
        </div>
      </footer>

      <nav className="nav" aria-label="Main">
        <a href="#home" className={active === "home" ? "on" : ""}><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg><span>{t.n_home}</span></a>
        <a href="#journey" className={active === "journey" ? "on" : ""}><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h6" /><circle cx="18" cy="17" r="3" /></svg><span>{t.n_journey}</span></a>
        <a href="#updates" className={active === "updates" ? "on" : ""}><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5" /></svg><span>{t.n_updates}</span></a>
        <a href="#media" className={active === "media" ? "on" : ""}><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 15l5-5 4 4 3-3 6 6" /></svg><span>{t.n_media}</span></a>
        <a href="#contact" className={active === "contact" ? "on" : ""}><svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></svg><span>{t.n_contact}</span></a>
      </nav>
    </>
  );
}
