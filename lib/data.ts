import { getPublicClient } from "./supabase";
import { seedGallery, seedMilestones, seedSocial, seedSpeeches, seedUpdates } from "./seed";
import type { GalleryItem, Milestone, SiteContent, SocialPost, Speech, Update } from "./types";

const SEED: SiteContent = {
  updates: seedUpdates,
  milestones: seedMilestones,
  speeches: seedSpeeches,
  gallery: seedGallery,
  social: seedSocial,
  source: "seed",
};

function pick<T>(rows: T[] | null | undefined, fallback: T[]): T[] {
  return rows && rows.length > 0 ? rows : fallback;
}

/** Loads all homepage content from Supabase, falling back to seed data per table. */
export async function getSiteContent(): Promise<SiteContent> {
  const sb = getPublicClient();
  if (!sb) return SEED;

  try {
    const [u, m, sp, g, s] = await Promise.all([
      sb.from("updates").select("*").eq("published", true).order("event_date", { ascending: false }).order("sort_order").limit(8),
      sb.from("milestones").select("*").eq("published", true).order("sort_order"),
      sb.from("speeches").select("*").eq("published", true).order("event_date", { ascending: false }).order("sort_order").limit(8),
      sb.from("gallery").select("*").eq("published", true).order("sort_order").limit(6),
      sb.from("social_posts").select("*").eq("published", true).order("sort_order"),
    ]);
    for (const r of [u, m, sp, g, s]) if (r.error) throw r.error;

    return {
      updates: pick(u.data as Update[], SEED.updates),
      milestones: pick(m.data as Milestone[], SEED.milestones),
      speeches: pick(sp.data as Speech[], SEED.speeches),
      gallery: pick(g.data as GalleryItem[], SEED.gallery),
      social: pick(s.data as SocialPost[], SEED.social),
      source: "supabase",
    };
  } catch (err) {
    console.error("[supabase] falling back to seed content:", err);
    return SEED;
  }
}
