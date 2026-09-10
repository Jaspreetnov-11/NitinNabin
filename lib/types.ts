export type Lang = "en" | "hi";
export type Platform = "fb" | "x" | "ig" | "yt";

export type Update = {
  id: string;
  event_date: string; // YYYY-MM-DD
  kind_en: string;
  kind_hi: string;
  title_en: string;
  title_hi: string;
  summary_en: string;
  summary_hi: string;
  place_en: string;
  place_hi: string;
  image_url: string | null;
  sort_order: number;
};

export type Milestone = {
  id: string;
  year: string;
  kind_en: string;
  kind_hi: string;
  title_en: string;
  title_hi: string;
  place_en: string;
  place_hi: string;
  body_en: string;
  body_hi: string;
  record_en: string;
  record_hi: string;
  sort_order: number;
};

export type Speech = {
  id: string;
  event_date: string; // YYYY-MM-DD
  kind_en: string;
  kind_hi: string;
  title_en: string;
  title_hi: string;
  venue_en: string;
  venue_hi: string;
  video_url: string | null; // when set, "Watch" link replaces the "no video" badge
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  image_url: string;
  caption_en: string;
  caption_hi: string;
  sub_en: string;
  sub_hi: string;
  sort_order: number;
};

export type SocialPost = {
  id: string;
  platform: Platform;
  image_url: string | null;
  text_en: string;
  text_hi: string;
  label_en: string; // e.g. "Tiranga Yatra" or video duration "18:42"
  label_hi: string;
  when_en: string; // "18 Aug 2026" or "3 days ago"
  when_hi: string;
  stats: string; // "👍 4.8K", "🔁 1.8K ❤️ 9.4K", "94K views"
  post_url: string | null;
  sort_order: number;
};

export type SiteContent = {
  updates: Update[];
  milestones: Milestone[];
  gallery: GalleryItem[];
  social: SocialPost[];
  source: "supabase" | "seed";
};
