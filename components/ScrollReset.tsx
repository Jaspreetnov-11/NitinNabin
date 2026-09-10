"use client";

import { useEffect } from "react";

/**
 * Fresh homepage loads start at the top (matches the static HTML's load handler).
 * Runs once on mount; a URL with a #hash is left alone, and later anchor clicks are untouched.
 */
export default function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    if (!window.location.hash) {
      // "instant" bypasses the CSS scroll-behavior: smooth on <html>.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);
  return null;
}
