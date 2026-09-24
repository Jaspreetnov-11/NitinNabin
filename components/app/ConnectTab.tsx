"use client";

import { useState, type FormEvent } from "react";
import { BrandIcon, buzz, IconDownload, PORTRAIT, SOCIAL_LINKS, type Ctx } from "./shared";

type Send = "idle" | "sending" | "ok" | "err";

export default function ConnectTab({ ctx, canInstall, onInstall, standalone }: { ctx: Ctx; canInstall: boolean; onInstall: () => void; standalone: boolean }) {
  const { t, lang } = ctx;
  const hi = lang === "hi";
  const [state, setState] = useState<Send>("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      if (!r.ok) throw new Error();
      form.reset();
      buzz(30);
      setState("ok");
    } catch {
      setState("err");
    }
  }

  return (
    <>
      <section className="ma-connect-hero">
        <img src={PORTRAIT} alt="" />
        <h1>{t.ct_h}</h1>
        <p>{t.ct_p}</p>
      </section>

      <div className="ma-socials">
        {SOCIAL_LINKS.map((s) => (
          <a key={s.p} href={s.url} target="_blank" rel="noopener" className={`s-${s.p}`}>
            <BrandIcon p={s.p} size={26} />
            <b>{t.social[s.p].label}</b>
            <small>{s.handle}</small>
          </a>
        ))}
      </div>

      {!standalone && (
        <section className="ma-install">
          <IconDownload size={26} />
          <div>
            <b>{hi ? "ऐप होम स्क्रीन पर जोड़ें" : "Add the app to your home screen"}</b>
            <small>
              {canInstall
                ? hi ? "एक टैप में इंस्टॉल करें — ऑफ़लाइन भी चलेगा।" : "Install in one tap — works offline too."
                : hi ? "iPhone: शेयर ⬆︎ → “Add to Home Screen”. Android: मेनू ⋮ → “Install app”." : "iPhone: Share ⬆︎ → “Add to Home Screen”. Android: menu ⋮ → “Install app”."}
            </small>
          </div>
          {canInstall && <button onClick={onInstall}>{hi ? "इंस्टॉल" : "Install"}</button>}
        </section>
      )}

      <section className="ma-card">
        <h2>{hi ? "संदेश भेजें" : "Send a message"}</h2>
        {state === "ok" ? (
          <div className="ma-sent">
            <span>✓</span>
            <b>{hi ? "संदेश मिल गया, धन्यवाद!" : "Message received — thank you!"}</b>
            <button onClick={() => setState("idle")}>{hi ? "एक और भेजें" : "Send another"}</button>
          </div>
        ) : (
          <form className="ma-form" onSubmit={submit}>
            <label>
              <span>{hi ? "नाम" : "Name"}</span>
              <input name="name" required minLength={2} maxLength={120} autoComplete="name" />
            </label>
            <label>
              <span>{hi ? "फ़ोन या ईमेल" : "Phone or email"}</span>
              <input name="contact" required minLength={3} maxLength={160} autoComplete="email" inputMode="email" />
            </label>
            <label>
              <span>{hi ? "संदेश" : "Message"}</span>
              <textarea name="message" required minLength={5} maxLength={2000} rows={4} />
            </label>
            <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
            <button type="submit" disabled={state === "sending"}>
              {state === "sending" ? (hi ? "भेज रहे हैं…" : "Sending…") : hi ? "भेजें" : "Send"}
            </button>
            {state === "err" && <p className="err">{hi ? "भेजा नहीं जा सका, दोबारा कोशिश करें।" : "Couldn't send — please try again."}</p>}
          </form>
        )}
      </section>

      <section className="ma-card ma-foot">
        <h2>{t.f_sources}</h2>
        <ul>
          <li><a href="https://www.bjp.org/shri-nitin-nabin" target="_blank" rel="noopener">bjp.org — official profile</a></li>
          <li><a href="https://prsindia.org/mlatrack/nitin-nabin" target="_blank" rel="noopener">PRS Legislative Research</a></li>
          <li><a href="https://ddnews.gov.in/en/nitin-nabin-takes-charge-as-bjp-national-president/" target="_blank" rel="noopener">DD News</a></li>
          <li><a href="https://en.wikipedia.org/wiki/Nitin_Nabin" target="_blank" rel="noopener">Wikipedia</a></li>
        </ul>
        <p className="mute">{t.f_policy1}</p>
        <p className="mute small">{t.f_copy}</p>
        <a className="web" href="/">{hi ? "पूरी वेबसाइट देखें →" : "View the full website →"}</a>
      </section>
    </>
  );
}
