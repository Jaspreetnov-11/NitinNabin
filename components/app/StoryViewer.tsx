"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { fmtDate } from "@/lib/format";
import { IconClose, IconPin, PORTRAIT, type Ctx } from "./shared";

const DURATION = 5500;

/** Full-screen, Instagram-style story player over the latest updates. */
export default function StoryViewer({ ctx, start, onClose, onSeen }: { ctx: Ctx; start: number; onClose: () => void; onSeen: (id: string) => void }) {
  const { content, lang, L } = ctx;
  const items = content.updates;
  const [i, setI] = useState(start);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const pressAt = useRef(0);
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  const u = items[i];

  const prog = useRef(0);
  const idx = useRef(start);

  const go = useCallback(
    (d: number) => {
      const next = idx.current + d;
      if (next >= items.length) return onClose();
      idx.current = Math.max(0, next);
      prog.current = 0;
      setProgress(0);
      setI(idx.current);
    },
    [items.length, onClose]
  );

  useEffect(() => {
    if (u) onSeen(u.id);
  }, [u, onSeen]);

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      prog.current += (now - last) / DURATION;
      last = now;
      if (prog.current >= 1) return go(1);
      setProgress(prog.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, i, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const down = (e: PointerEvent) => {
    pressAt.current = Date.now();
    startY.current = e.clientY;
    setPaused(true);
  };
  const move = (e: PointerEvent) => {
    if (startY.current !== null) setDragY(Math.max(0, e.clientY - startY.current));
  };
  const up = (e: PointerEvent) => {
    const held = Date.now() - pressAt.current;
    const dy = startY.current !== null ? e.clientY - startY.current : 0;
    startY.current = null;
    setPaused(false);
    setDragY(0);
    if (dy > 110) return onClose();
    if (held > 250 || Math.abs(dy) > 12) return; // long-press = pause only
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    go(e.clientX - rect.left < rect.width * 0.33 ? -1 : 1);
  };

  if (!u) return null;

  return (
    <div className="ma-story" role="dialog" aria-modal="true" aria-label={L(u.title_en, u.title_hi)} style={{ transform: `translateY(${dragY}px) scale(${1 - dragY / 1600})`, opacity: 1 - dragY / 600 }}>
      {u.image_url && <img key={u.id} className="bg" src={u.image_url} alt="" />}
      <div className="shade" />
      <div className="bars">
        {items.map((it, k) => (
          <span key={it.id}>
            <i style={{ transform: `scaleX(${k < i ? 1 : k === i ? progress : 0})` }} />
          </span>
        ))}
      </div>
      <div className="hd">
        <img src={PORTRAIT} alt="" />
        <div>
          <b>{ctx.t.name}</b>
          <small>{fmtDate(u.event_date, lang)}</small>
        </div>
        <button onClick={onClose} aria-label="Close"><IconClose /></button>
      </div>
      <div className="tap" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { setPaused(false); setDragY(0); startY.current = null; }} />
      <div className="body" key={`b-${u.id}`}>
        <span className="kind">{L(u.kind_en, u.kind_hi)}</span>
        <h2>{L(u.title_en, u.title_hi)}</h2>
        <p>{L(u.summary_en, u.summary_hi)}</p>
        <div className="place"><IconPin size={16} />{L(u.place_en, u.place_hi)}</div>
      </div>
      {paused && <div className="paused">❚❚</div>}
    </div>
  );
}
