import type { Lang } from "./types";

const EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const HI = ["जन", "फ़र", "मार्च", "अप्रैल", "मई", "जून", "जुल", "अग", "सित", "अक्टू", "नव", "दिस"];

/** "2026-08-18" → "18 Aug 2026" / "18 अग 2026" */
export function fmtDate(iso: string | null | undefined, lang: Lang): string {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${(lang === "hi" ? HI : EN)[m - 1]} ${y}`;
}
