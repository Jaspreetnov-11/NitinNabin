"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import type { Lang, Platform, SiteContent } from "@/lib/types";
import { STRINGS, PLATFORMS } from "@/lib/i18n";
import { fmtDate } from "@/lib/format";
import ContactForm from "./ContactForm";

const IMG = "https://www.nitinnabin.com/images";
const NAV_IDS = ["home", "journey", "updates", "media", "contact"];

export default function Site({ content }: { content: SiteContent }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = STRINGS[lang];
  const L = <T,>(en: T, hi: T) => (lang === "hi" ? hi : en);

  // journey
  const [jIdx, setJIdx] = useState(Math.max(0, content.milestones.length - 1));
  const yearsRef = useRef<HTMLDivElement>(null);
  const j = content.milestones[jIdx];

  // social
  const [soc, setSoc] = useState<Platform>("fb");
  const [page, setPage] = useState<Record<Platform, number>>({ fb: 0, x: 0, ig: 0, yt: 0 });
  const touchX = useRef<number | null>(null);
  const posts = content.social.filter((p) => p.platform === soc);
  const prof = t.social[soc];
  const n = posts.length;
  const cur = Math.min(page[soc], Math.max(0, n - 1));
  const slide = (d: number) => setPage((p) => ({ ...p, [soc]: Math.max(0, Math.min(n - 1, cur + d)) }));

  // bottom nav
  const [active, setActive] = useState("home");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const sel = yearsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    sel?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
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

  const onTouchStart = (e: TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) slide(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const ticker = content.updates.map((u) => `${fmtDate(u.event_date, lang)} — ${L(u.title_en, u.title_hi)}`);

  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="b" href="#home"><span>{t.name}</span><small>{t.role_short}</small></a>
          <ul>
            <li><a href="#about">{t.n_about}</a></li><li><a href="#journey">{t.n_journey}</a></li><li><a href="#work">{t.n_work}</a></li>
            <li><a href="#updates">{t.n_updates}</a></li><li><a href="#speeches">{t.n_speeches}</a></li><li><a href="#media">{t.n_media}</a></li><li><a href="#contact">{t.n_contact}</a></li>
          </ul>
          <div className="l" role="group" aria-label="Language">
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "hi" ? "on" : ""} onClick={() => setLang("hi")}>हिं</button>
          </div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="wrap">
          <div className="blob" />
          <div className="txt">
            <div className="r">{t.role}</div>
            <h1><span>{t.first}</span><span>{t.last}</span></h1>
            <p>{t.hero_p}</p>
            <div className="acts"><a className="btn" href="#journey">{t.cta1}</a><a className="btn o" href="#updates">{t.cta2}</a></div>
          </div>
          <div className="por"><img src={`${IMG}/portrait-cutout.png`} alt="Nitin Nabin, official portrait" /></div>
        </div>
      </section>

      <div className="tick" aria-hidden="true">
        <div>{[...ticker, ...ticker].map((s, i) => <span key={i}>{s}</span>)}</div>
      </div>

      <section className="stats">
        <div className="wrap">
          {t.stats.map((s) => <div key={s[1]}><div className="disp">{s[0]}</div><small>{s[1]}<em>{s[2]}</em></small></div>)}
        </div>
      </section>

      <section className="intro" id="about">
        <div className="wrap">
          <div className="ph"><img src={`${IMG}/portrait-bio.avif`} alt="" loading="lazy" /><span>{t.born}</span></div>
          <div>
            <h2>{t.about_h}</h2>
            <div className="facts">{t.facts.map((f) => <div key={f[0]}><small>{f[0]}</small><b>{f[1]}</b></div>)}</div>
            <div>{t.bio.map((p, i) => <p key={i}>{p}</p>)}</div>
            <a className="more" href="#journey">{t.bio_more}</a>
          </div>
        </div>
      </section>

      <div className="band">
        <img src={`${IMG}/hero-bg.jpg`} alt="" loading="lazy" />
        <div className="cap"><div className="wrap"><b>{t.band1}</b><small>{t.band1s}</small></div></div>
      </div>

      <section className="jr" id="journey">
        <div className="wrap">
          <h2>{t.jr_h}</h2>
          <p className="lead">{t.jr_p}</p>
          <div className="years" role="tablist" ref={yearsRef}>
            {content.milestones.map((m, i) => (
              <button key={m.id} className="yr" role="tab" aria-selected={i === jIdx} onClick={() => setJIdx(i)}>
                <small>{L(m.kind_en, m.kind_hi)}</small>{m.year}
              </button>
            ))}
          </div>
          {j && (
            <article className="jcard" aria-live="polite">
              <div><div className="yy">{j.year}</div><div className="k">{L(j.kind_en, j.kind_hi)}</div></div>
              <div>
                <h3>{L(j.title_en, j.title_hi)}</h3>
                <div className="w">{L(j.place_en, j.place_hi)}</div>
                <p>{L(j.body_en, j.body_hi)}</p>
                <div className="rec"><b>{t.record}</b> — {L(j.record_en, j.record_hi)}</div>
              </div>
            </article>
          )}
          <div className="jnav">
            <button onClick={() => setJIdx((i) => i - 1)} disabled={jIdx === 0}>←</button>
            <button onClick={() => setJIdx((i) => i + 1)} disabled={jIdx >= content.milestones.length - 1}>→</button>
          </div>
        </div>
      </section>

      <section className="four" id="work">
        <div className="wrap">
          <h2>{t.four_h}</h2>
          <p className="lead">{t.four_p}</p>
          <div className="grid">
            {t.four.map((f, i) => (
              <article key={f[1]} className={`a${i + 1}`}>
                <div className="n">0{i + 1}</div>
                <div className="tg">{f[0]} ↗</div>
                <h3>{f[1]}</h3>
                <p>{f[2]}</p>
                <ul>{f[3].map((x) => <li key={x}>{x}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="rec">
            <h3>{t.rec_h}</h3>
            <p className="rp">{t.rec_p}</p>
            <ol>{t.recl.map((r) => <li key={r[0]}><b>{r[0]}</b><span>{r[1]}</span></li>)}</ol>
          </div>
        </div>
      </section>

      <section className="pos">
        <div className="wrap">
          <h2>{t.pos_h}</h2>
          <p className="lead">{t.pos_p}</p>
          <ol>
            {t.pos.map((p, i, a) => {
              const last = i === a.length - 1;
              return (
                <li key={p[0] + p[1]} className={last ? "now" : undefined}>
                  <span className="d">{p[0]}</span>
                  <span>{last ? <b>{p[1]}</b> : p[1]}<span className="o">{p[2]}</span></span>
                </li>
              );
            })}
          </ol>
          <p className="note">{t.pos_note}</p>
        </div>
      </section>

      <div className="band">
        <img src={`${IMG}/portrait-fields.avif`} alt="" loading="lazy" />
        <div className="cap"><div className="wrap"><b>{t.band2}</b><small>{t.band2s}</small></div></div>
      </div>

      <section className="upd" id="updates">
        <div className="wrap">
          <div className="head"><h2>{t.upd_h}</h2><a href="#updates">{t.see_all}</a></div>
          <div className="grid">
            {content.updates.map((u) => (
              <article className="u" key={u.id}>
                {u.image_url && <img src={u.image_url} alt="" loading="lazy" />}
                <div className="b">
                  <span className="t">{L(u.kind_en, u.kind_hi)} · {fmtDate(u.event_date, lang)}</span>
                  <h3>{L(u.title_en, u.title_hi)}</h3>
                  <p>{L(u.summary_en, u.summary_hi)}</p>
                  <small>{L(u.place_en, u.place_hi)}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" id="speeches">
        <div className="wrap">
          <h2>{t.sp_h}</h2>
          <p className="lead">{t.sp_p}</p>
          <ul>
            {content.speeches.map((s) => (
              <li key={s.id}>
                <div>
                  <span className="tg">{L(s.kind_en, s.kind_hi)}</span>
                  <h3>{L(s.title_en, s.title_hi)}</h3>
                  <small>{fmtDate(s.event_date, lang)} · {L(s.venue_en, s.venue_hi)}</small>
                </div>
                {s.video_url
                  ? <a className="na yes" href={s.video_url} target="_blank" rel="noopener">{t.watch} ↗</a>
                  : <span className="na">{t.na}</span>}
              </li>
            ))}
          </ul>
        </div>
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

      <section className="nl">
        <div className="wrap">
          <h2>{t.nl_h}</h2>
          <div className="grid">
            {t.nl.map((x) => (
              <article key={x[0]}><span className="tg">{x[0]}</span><h3>{x[1]}</h3><div className="yrs">{x[2]}</div><p>{x[3]}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section id="social">
        <div className="wrap">
          <h2>{t.soc_h}</h2>
          <div className="tabs" role="tablist">
            {PLATFORMS.map((k) => (
              <button key={k} className="tab" role="tab" aria-selected={k === soc} onClick={() => setSoc(k)}>{t.social[k].label}</button>
            ))}
          </div>
          <div className="feed">
            <div className="who">
              <img src={`${IMG}/portrait-cutout.png`} alt="" />
              <div><b>{prof.who}</b><small>{prof.sub}</small></div>
              <a href={prof.url} target="_blank" rel="noopener">{prof.btn}</a>
            </div>
            <div className="car" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="track" style={{ transform: `translateX(-${cur * 100}%)` }}>
                {posts.map((p) => (
                  <div className="post" key={p.id}>
                    {p.image_url && <img src={p.image_url} alt="" loading="lazy" />}
                    <div className="pt">
                      <p>{L(p.text_en, p.text_hi)}</p>
                      <div className="m"><b>{L(p.label_en, p.label_hi)}</b> · {L(p.when_en, p.when_hi)} · {p.stats}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pg">
              <div className="bt">
                <button onClick={() => slide(-1)} disabled={cur === 0} aria-label="prev">‹</button>
                <button onClick={() => slide(1)} disabled={cur >= n - 1} aria-label="next">›</button>
              </div>
              <span>{n ? t.post_of(cur + 1, n) : ""}</span>
              <a href={posts[cur]?.post_url ?? prof.url} target="_blank" rel="noopener">{t.view_on} {prof.label}</a>
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
              <li><a href="#speeches">{t.n_speeches}</a></li><li><a href="#media">{t.n_media}</a></li><li><a href="#updates">{t.n_updates}</a></li><li><a href="#contact">{t.n_contact}</a></li>
            </ul>
          </div>
          <div className="src">
            <h4>{t.f_sources}</h4>
            <ul>
              <li><a href="https://www.bjp.org/shri-nitin-nabin">bjp.org — official profile</a></li>
              <li><a href="https://prsindia.org/mlatrack/nitin-nabin">PRS Legislative Research</a></li>
              <li><a href="https://ddnews.gov.in/en/nitin-nabin-takes-charge-as-bjp-national-president/">DD News</a></li>
              <li><a href="https://www.newsonair.gov.in/">Akashvani News</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Nitin_Nabin">Wikipedia</a></li>
            </ul>
          </div>
          <div><h4>{t.f_policy}</h4><p>{t.f_policy1}</p><p>{t.f_policy2}</p></div>
          <div className="legal">
            <span>{t.f_copy}</span>
            <span><a href="#">{t.f_a11y}</a><a href="#">{t.f_privacy}</a><a href="#">{t.f_corr}</a></span>
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
