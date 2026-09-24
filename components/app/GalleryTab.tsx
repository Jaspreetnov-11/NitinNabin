"use client";

import { useEffect, useRef, useState } from "react";
import { buzz, IconClose, type Ctx } from "./shared";

function Lightbox({ ctx, start, onClose }: { ctx: Ctx; start: number; onClose: () => void }) {
  const { content, L } = ctx;
  const g = content.gallery;
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(start);

  useEffect(() => {
    const el = track.current;
    if (el) el.scrollTo({ left: start * el.clientWidth });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (el && (e.key === "ArrowRight" || e.key === "ArrowLeft")) el.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * el.clientWidth, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, onClose]);

  const cur = g[i];
  return (
    <div className="ma-lb" role="dialog" aria-modal="true">
      <button className="x" onClick={onClose} aria-label="Close"><IconClose /></button>
      <div className="track" ref={track} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {g.map((x) => (
          <figure key={x.id}><img src={x.image_url} alt={L(x.caption_en, x.caption_hi)} /></figure>
        ))}
      </div>
      {cur && (
        <div className="cap">
          <b>{L(cur.caption_en, cur.caption_hi)}</b>
          <small>{L(cur.sub_en, cur.sub_hi)}</small>
          <span>{i + 1} / {g.length}</span>
        </div>
      )}
    </div>
  );
}

export default function GalleryTab({ ctx }: { ctx: Ctx }) {
  const { content, t, L, lang } = ctx;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <header className="ma-fhead">
        <h1>{t.gal_h}</h1>
        <span className="count">{content.gallery.length} {lang === "hi" ? "चित्र" : "photos"}</span>
      </header>
      <div className="ma-masonry">
        {content.gallery.map((g, i) => (
          <button key={g.id} className={`tile t${i % 5}`} onClick={() => { buzz(); setOpen(i); }}>
            <img src={g.image_url} alt={L(g.caption_en, g.caption_hi)} loading="lazy" />
            <span><b>{L(g.caption_en, g.caption_hi)}</b><small>{L(g.sub_en, g.sub_hi)}</small></span>
          </button>
        ))}
      </div>

      <section className="ma-card ma-nl">
        <h2>{t.nl_h}</h2>
        {t.nl.map((x) => (
          <div key={x[0]} className="row">
            <small>{x[0]} · {x[2]}</small>
            <h3>{x[1]}</h3>
            <p>{x[3]}</p>
          </div>
        ))}
      </section>

      {open !== null && <Lightbox ctx={ctx} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
