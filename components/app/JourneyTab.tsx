"use client";

import { useEffect, useRef, useState } from "react";
import { buzz, type Ctx } from "./shared";

export default function JourneyTab({ ctx }: { ctx: Ctx }) {
  const { content, t, L } = ctx;
  const ms = content.milestones;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.i);
          if (i === activeRef.current) continue;
          activeRef.current = i;
          buzz(4);
          setActive(i);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [ms.length]);

  const m = ms[active];
  const first = ms[0]?.year ?? "";
  const last = ms[ms.length - 1]?.year ?? "";
  const pct = ms.length > 1 ? (active / (ms.length - 1)) * 100 : 100;

  return (
    <>
      <header className="ma-jhead">
        <span className="eb">{first} → {last}</span>
        <h1>{t.jr_h}</h1>
        <p>{t.jr_p.split(".")[0]}.</p>
      </header>

      <div className="ma-odo" aria-hidden="true">
        <div className="big" key={m?.year}>{m?.year}</div>
        <div className="meta">
          <b>{m ? L(m.kind_en, m.kind_hi) : ""}</b>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
          <small>{active + 1} / {ms.length}</small>
        </div>
      </div>

      <ol className="ma-tl">
        {ms.map((x, i) => (
          <li key={x.id} data-i={i} ref={(el) => { refs.current[i] = el; }} className={i === active ? "on" : i < active ? "past" : undefined}>
            <span className="dot" />
            <article>
              <div className="y">{x.year}<small>{L(x.kind_en, x.kind_hi)}</small></div>
              <h3>{L(x.title_en, x.title_hi)}</h3>
              <div className="w">{L(x.place_en, x.place_hi)}</div>
              <p>{L(x.body_en, x.body_hi)}</p>
              <div className="rc"><b>{t.record}</b> {L(x.record_en, x.record_hi)}</div>
            </article>
          </li>
        ))}
      </ol>

      <section className="ma-card">
        <h2>{t.rec_h}</h2>
        <p className="mute">{t.rec_p}</p>
        <div className="ma-votes">
          {t.recl.map((r) => (
            <div key={r[0]}><b>{r[0]}</b><span>{r[1]}</span></div>
          ))}
        </div>
      </section>

      <section className="ma-card">
        <h2>{t.pos_h}</h2>
        <p className="mute">{t.pos_p}</p>
        <ul className="ma-pos">
          {[...t.pos].reverse().map((p, i) => (
            <li key={p[0] + p[1]} className={i === 0 ? "now" : undefined}>
              <small>{p[0]}</small>
              <b>{p[1]}</b>
              <span>{p[2]}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
