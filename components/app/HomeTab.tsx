"use client";

import { useState } from "react";
import { fmtDate } from "@/lib/format";
import { buzz, IconArrow, PORTRAIT, PRESIDENT_SINCE, useCountUp, useDaysSince, type Ctx } from "./shared";

function Stat({ num, label, sub }: { num: string; label: string; sub: string }) {
  const [ref, v] = useCountUp(Number(num));
  return (
    <div className="ma-stat" ref={ref}>
      <b>{String(v).padStart(num.length, "0")}</b>
      <span>{label}</span>
      <small>{sub}</small>
    </div>
  );
}

export default function HomeTab({ ctx, seen, openStory, goto }: { ctx: Ctx; seen: Set<string>; openStory: (i: number) => void; goto: (tab: "journey" | "feed") => void }) {
  const { content, lang, t, L } = ctx;
  const days = useDaysSince(PRESIDENT_SINCE);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [bioOpen, setBioOpen] = useState(false);
  const hi = lang === "hi";

  return (
    <>
      {/* stories */}
      <div className="ma-stories" role="list" aria-label={hi ? "कहानियाँ" : "Stories"}>
        {content.updates.map((u, i) => (
          <button key={u.id} role="listitem" className={`ma-bubble${seen.has(u.id) ? " seen" : ""}`} onClick={() => { buzz(); openStory(i); }}>
            <span className="ring">{u.image_url ? <img src={u.image_url} alt="" loading="lazy" /> : <em>{fmtDate(u.event_date, lang).split(" ")[0]}</em>}</span>
            <small>{L(u.kind_en, u.kind_hi)}</small>
          </button>
        ))}
      </div>

      {/* hero */}
      <section className="ma-hero">
        <div className="orb" />
        <div className="rings"><i /><i /><i /></div>
        <img className="por" src={PORTRAIT} alt="" />
        <div className="txt">
          <span className="chip">{t.role_1}</span>
          <h1><span>{t.first}</span><span>{t.last}</span></h1>
          <p>{t.role_2}</p>
        </div>
        <div className="days" aria-live="polite">
          <b>{days ?? "—"}</b>
          <span>{hi ? "राष्ट्रीय अध्यक्ष के रूप में दिन" : days === 1 ? "day as National President" : "days as National President"}</span>
        </div>
      </section>

      <p className="ma-lede">{t.hero_p}</p>

      {/* stats */}
      <div className="ma-stats">
        {t.stats.map((s) => <Stat key={s[1]} num={s[0]} label={s[1]} sub={s[2]} />)}
      </div>

      {/* latest */}
      <div className="ma-sec-h">
        <h2>{t.upd_h}</h2>
        <button onClick={() => openStory(0)}>{hi ? "सब देखें" : "Play all"} ▶</button>
      </div>
      <div className="ma-hscroll">
        {content.updates.map((u, i) => (
          <button key={u.id} className="ma-upd" onClick={() => openStory(i)}>
            {u.image_url && <img src={u.image_url} alt="" loading="lazy" />}
            <div>
              <small>{L(u.kind_en, u.kind_hi)} · {fmtDate(u.event_date, lang)}</small>
              <h3>{L(u.title_en, u.title_hi)}</h3>
              <span>{L(u.place_en, u.place_hi)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* four fields: flip cards */}
      <div className="ma-sec-h">
        <h2>{t.four_h[0]} <em>{t.four_h[1]}</em> {t.four_h[2]}</h2>
      </div>
      <p className="ma-hint">{hi ? "कार्ड पलटने के लिए टैप करें" : "Tap a card to flip it"}</p>
      <div className="ma-flips">
        {t.four.map((f, i) => (
          <button key={f[1]} className={`ma-flip${flipped === i ? " on" : ""}`} onClick={() => { buzz(); setFlipped(flipped === i ? null : i); }} aria-pressed={flipped === i}>
            <span className="inner">
              <span className="front">
                <small>{f[0]}</small>
                <b>{f[3].match(/^\d+/)?.[0] ?? ""}</b>
                <h3>{f[1]}</h3>
              </span>
              <span className="back">
                <small>{f[1]}</small>
                <p>{f[2]}</p>
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* bio */}
      <section className={`ma-bio${bioOpen ? " open" : ""}`}>
        <span className="eb">{t.about_eb}</span>
        <h2>{t.about_h[0]} <em>{t.about_h[1]}</em></h2>
        {t.bio.map((p, i) => <p key={i} className={i > 0 ? "x" : undefined}>{p}</p>)}
        <button onClick={() => setBioOpen((v) => !v)}>{bioOpen ? t.show_less : t.read_more}</button>
        <dl>
          {t.facts.map((f) => (
            <div key={f[0]}><dt>{f[0]}</dt><dd>{f[1]}</dd></div>
          ))}
        </dl>
      </section>

      <div className="ma-cta-row">
        <button className="ma-cta" onClick={() => goto("journey")}>{t.cta1} <IconArrow size={18} /></button>
        <button className="ma-cta o" onClick={() => goto("feed")}>{hi ? "सोशल फ़ीड" : "Social feed"}</button>
      </div>
    </>
  );
}
