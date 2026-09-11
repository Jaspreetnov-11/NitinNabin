import { getPublicClient } from "./supabase";
import { seedGallery, seedMilestones, seedSocial, seedUpdates } from "./seed";
import { getLiveYouTubeFeed } from "./social";
import type { GalleryItem, Milestone, SiteContent, SocialPost, Update } from "./types";

const SEED: SiteContent = {
  updates: seedUpdates,
  milestones: seedMilestones,
  gallery: seedGallery,
  social: seedSocial,
  source: "seed",
};

function pick<T>(rows: T[] | null | undefined, fallback: T[]): T[] {
  return rows && rows.length > 0 ? rows : fallback;
}

function mergeLivePosts(basePosts: SocialPost[], liveYt: SocialPost[]): SocialPost[] {
  const nonYt = basePosts.filter((p) => p.platform !== "yt");
  const yt = liveYt && liveYt.length > 0 ? liveYt : basePosts.filter((p) => p.platform === "yt");

  const fb = nonYt.filter((p) => p.platform === "fb");
  const x = nonYt.filter((p) => p.platform === "x");
  const ig = nonYt.filter((p) => p.platform === "ig");

  // Interleave for a dynamic, multi-platform 'All Feeds' view: FB, X, IG, YT
  const maxLen = Math.max(fb.length, x.length, ig.length, yt.length);
  const interleaved: SocialPost[] = [];
  for (let i = 0; i < maxLen; i++) {
    if (fb[i]) interleaved.push(fb[i]);
    if (x[i]) interleaved.push(x[i]);
    if (ig[i]) interleaved.push(ig[i]);
    if (yt[i]) interleaved.push(yt[i]);
  }
  return interleaved;
}

/** Loads all homepage content from Supabase, falling back to seed data per table, augmented with live feeds. */
export async function getSiteContent(): Promise<SiteContent> {
  const sb = getPublicClient();
  const liveYtPromise = getLiveYouTubeFeed().catch(() => [] as SocialPost[]);

  if (!sb) {
    const liveYt = await liveYtPromise;
    return {
      ...SEED,
      social: mergeLivePosts(seedSocial, liveYt),
    };
  }

  try {
    const [u, m, g, s, liveYt] = await Promise.all([
      sb.from("updates").select("*").eq("published", true).order("event_date", { ascending: false }).order("sort_order").limit(8),
      sb.from("milestones").select("*").eq("published", true).order("sort_order"),
      sb.from("gallery").select("*").eq("published", true).order("sort_order").limit(6),
      sb.from("social_posts").select("*").eq("published", true).order("sort_order"),
      liveYtPromise,
    ]);
    for (const r of [u, m, g, s]) if (r.error) throw r.error;

    const baseSocial = pick(s.data as SocialPost[], SEED.social);

    return {
      updates: pick(u.data as Update[], SEED.updates),
      milestones: pick(m.data as Milestone[], SEED.milestones),
      gallery: pick(g.data as GalleryItem[], SEED.gallery),
      social: mergeLivePosts(baseSocial, liveYt),
      source: "supabase",
    };
  } catch (err) {
    console.error("[supabase] falling back to seed content:", err);
    const liveYt = await liveYtPromise;
    return {
      ...SEED,
      social: mergeLivePosts(seedSocial, liveYt),
    };
  }
}
