"use client";

import { useEffect, useRef, useState } from "react";
import type { SocialPost, SocialTab } from "@/lib/types";
import { PLATFORMS } from "@/lib/i18n";
import { BrandIcon, buzz, IconHeart, IconShare, PORTRAIT, readLocal, writeLocal, type Ctx } from "./shared";

const HANDLE: Record<string, string> = { fb: "@NitinNabinBJP", x: "@NitinNabin", ig: "@nitinnabinbjp", yt: "@BJP4India" };
const LIKES_KEY = "nn-app-likes";

function PostCard({ p, ctx, liked, onLike }: { p: SocialPost; ctx: Ctx; liked: boolean; onLike: (id: string, force?: boolean) => void }) {
  const { L, lang, t } = ctx;
  const [burst, setBurst] = useState(0);
  const lastTap = useRef(0);
  const [toast, setToast] = useState("");
  const hi = lang === "hi";

  const onMediaTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 320) {
      onLike(p.id, true);
      setBurst((b) => b + 1);
      buzz(18);
    }
    lastTap.current = now;
  };

  const share = async () => {
    const url = p.post_url ?? location.href;
    const text = L(p.text_en, p.text_hi).slice(0, 140);
    try {
      if (navigator.share) await navigator.share({ title: t.name, text, url });
      else {
        await navigator.clipboard.writeText(url);
        setToast(hi ? "लिंक कॉपी हुआ" : "Link copied");
        setTimeout(() => setToast(""), 1600);
      }
    } catch {}
  };

  return (
    <article className="ma-post">
      <header>
        <img src={PORTRAIT} alt="" />
        <div>
          <b>{t.name} <svg viewBox="0 0 24 24" width="14" height="14" fill="#1877F2" aria-label="verified"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg></b>
          <small>{HANDLE[p.platform]} · {L(p.when_en, p.when_hi)}</small>
        </div>
        <span className="pf"><BrandIcon p={p.platform} size={20} /></span>
      </header>
      {p.image_url && (
        <div className="media" onClick={onMediaTap}>
          <img src={p.image_url} alt="" loading="lazy" />
          {p.platform === "yt" && <span className="play">▶</span>}
          {burst > 0 && <span className="burst" key={burst}><IconHeart size={96} filled /></span>}
        </div>
      )}
      <div className="acts">
        <button className={liked ? "liked" : undefined} onClick={() => { buzz(10); onLike(p.id); }} aria-pressed={liked} aria-label="Like">
          <IconHeart filled={liked} />
        </button>
        <button onClick={share} aria-label="Share"><IconShare /></button>
        <span className="st">{p.stats}</span>
        {p.post_url && (
          <a href={p.post_url} target="_blank" rel="noopener">
            {p.platform === "yt" ? (hi ? "देखें ▶" : "Watch ▶") : (hi ? "खोलें ↗" : "Open ↗")}
          </a>
        )}
      </div>
      <p className="txt"><b className="tag">{L(p.label_en, p.label_hi)}</b> {L(p.text_en, p.text_hi)}</p>
      {toast && <div className="ma-toast">{toast}</div>}
    </article>
  );
}

export default function FeedTab({ ctx }: { ctx: Ctx }) {
  const { content, t, lang } = ctx;
  const [posts, setPosts] = useState<SocialPost[]>(content.social);
  const [tab, setTab] = useState<SocialTab>("all");
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const hi = lang === "hi";

  useEffect(() => {
    setLikes(new Set(readLocal<string[]>(LIKES_KEY, [])));
    fetch("/api/social")
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.social) && d.social.length > 0) setPosts(d.social);
      })
      .catch(() => {});
  }, []);

  const like = (id: string, force?: boolean) =>
    setLikes((cur) => {
      const next = new Set(cur);
      if (force) next.add(id);
      else if (next.has(id)) next.delete(id);
      else next.add(id);
      writeLocal(LIKES_KEY, [...next]);
      return next;
    });

  const shown = tab === "all" ? posts : posts.filter((p) => p.platform === tab);
  const prof = t.social[tab];

  return (
    <>
      <header className="ma-fhead">
        <h1>{hi ? "फ़ीड" : "Feed"}</h1>
        <span className="live"><i />{hi ? "लाइव" : "Live"}</span>
      </header>
      <div className="ma-chips" role="tablist">
        {PLATFORMS.map((k) => (
          <button key={k} role="tab" aria-selected={k === tab} className={k === tab ? "on" : undefined} onClick={() => { buzz(); setTab(k); }}>
            {k !== "all" && <BrandIcon p={k} size={14} />}
            {t.social[k].label}
          </button>
        ))}
      </div>
      {tab !== "all" && (
        <a className="ma-prof" href={prof.url} target="_blank" rel="noopener">
          <BrandIcon p={tab} size={26} />
          <div><b>{prof.who}</b><small>{prof.sub}</small></div>
          <span>{prof.btn}</span>
        </a>
      )}
      <p className="ma-hint">{hi ? "तस्वीर पर डबल-टैप करके पसंद करें ❤" : "Double-tap a photo to like ❤"}</p>
      <div className="ma-posts">
        {shown.map((p) => <PostCard key={p.id} p={p} ctx={ctx} liked={likes.has(p.id)} onLike={like} />)}
        {shown.length === 0 && <p className="ma-empty">{hi ? "अभी कोई पोस्ट नहीं" : "No posts yet"}</p>}
      </div>
    </>
  );
}
