"use client";

import { useState, type FormEvent } from "react";
import type { Lang } from "@/lib/types";

type State = "idle" | "sending" | "ok" | "err";

export default function ContactForm({ lang }: { lang: Lang }) {
  const [state, setState] = useState<State>("idle");
  const t = (en: string, hi: string) => (lang === "hi" ? hi : en);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (r.ok) {
        form.reset();
        setState("ok");
      } else {
        setState("err");
      }
    } catch {
      setState("err");
    }
  }

  return (
    <form className="cf" onSubmit={onSubmit} noValidate={false}>
      <input
        name="name"
        required
        minLength={2}
        maxLength={120}
        placeholder={t("Your name", "आपका नाम")}
        autoComplete="name"
      />
      <input
        name="contact"
        required
        minLength={3}
        maxLength={160}
        placeholder={t("Email or phone", "ईमेल या फ़ोन")}
        autoComplete="email"
      />
      <textarea
        name="message"
        required
        minLength={5}
        maxLength={2000}
        rows={3}
        placeholder={t("Your message", "आपका संदेश")}
      />
      {/* honeypot — hidden from humans */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button className="btn" type="submit" disabled={state === "sending"}>
        {state === "sending" ? t("Sending…", "भेजा जा रहा है…") : t("Send message", "संदेश भेजें")}
      </button>
      {state === "ok" && (
        <p className="cf-msg ok" role="status">
          {t("Thank you. Your message has been received.", "धन्यवाद। आपका संदेश प्राप्त हो गया है।")}
        </p>
      )}
      {state === "err" && (
        <p className="cf-msg err" role="alert">
          {t("Could not send. Please try again.", "भेज नहीं सका। कृपया पुनः प्रयास करें।")}
        </p>
      )}
    </form>
  );
}
