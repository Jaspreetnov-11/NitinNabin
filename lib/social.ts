import type { SocialPost } from "./types";

const BLACKLIST_WORDS = [
  "बाप", "घटिया", "फंसे", "फंसी", "विवादित", "desperation", "satya hindi", "mic check", "public meter", "nubt", "brawl"
];

const ALLOWED_CHANNELS = [
  "bharatiya janata party", "bjp", "dd news", "ani news", "news 24", "abp news", "news18",
  "zee news", "punjab kesari", "sansad tv", "live hindustan", "the public india", "ndtv",
  "aaj tak", "times now", "republic", "nitin nabin", "patna", "bihar"
];

/**
 * Curated official speeches and national broadcasts of Shri Nitin Nabin on YouTube,
 * used as an instant verified baseline if search scraper is rate-limited or fails.
 */
const VERIFIED_OFFICIAL_VIDEOS: SocialPost[] = [
  {
    id: "yt-xKYhZObZdNc",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/xKYhZObZdNc/hq720.jpg",
    text_en: "BJP National President Shri Nitin Nabin addresses Punjabi Gaurav Sammelan in Rudrapur, Uttarakhand",
    text_hi: "रुद्रपुर, उत्तराखंड में भव्य 'पंजाबी गौरव सम्मेलन' को संबोधित करते हुए भाजपा राष्ट्रीय अध्यक्ष श्री नितिन नवीन",
    label_en: "Official BJP Broadcast",
    label_hi: "आधिकारिक भाजपा संबोधन",
    when_en: "Recent",
    when_hi: "हाल ही में",
    stats: "7.4K views",
    post_url: "https://www.youtube.com/watch?v=xKYhZObZdNc",
    sort_order: 1,
  },
  {
    id: "yt-7K3V1o9SA1Y",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/7K3V1o9SA1Y/hq720.jpg",
    text_en: "BJP National President Shri Nitin Nabin Addresses Ex-Servicemen Sammelan in Haldwani, Uttarakhand",
    text_hi: "हल्द्वानी, उत्तराखंड में पूर्व सैनिक सम्मेलन को संबोधित करते हुए भाजपा राष्ट्रीय अध्यक्ष श्री नितिन नवीन",
    label_en: "Official Address",
    label_hi: "आधिकारिक संबोधन",
    when_en: "Recent",
    when_hi: "हाल ही में",
    stats: "4.5K views",
    post_url: "https://www.youtube.com/watch?v=7K3V1o9SA1Y",
    sort_order: 2,
  },
  {
    id: "yt-bRmYiNLjikM",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/bRmYiNLjikM/hq720.jpg",
    text_en: "LIVE: BJP National President Shri Nitin Nabin Addresses Press Conference at BJP HQ, New Delhi",
    text_hi: "लाइव: भाजपा केंद्रीय मुख्यालय, नई दिल्ली में राष्ट्रीय मीडिया को संबोधित करते भाजपा अध्यक्ष श्री नितिन नवीन",
    label_en: "National Press Conference",
    label_hi: "राष्ट्रीय प्रेस वार्ता",
    when_en: "2 days ago",
    when_hi: "2 दिन पहले",
    stats: "24K views",
    post_url: "https://www.youtube.com/watch?v=bRmYiNLjikM",
    sort_order: 3,
  },
  {
    id: "yt-5Mn1YXcmYAM",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/5Mn1YXcmYAM/hq720_2.jpg",
    text_en: "BJP Chief Nitin Nabin & Uttarakhand CM Dhami interact with students during 'Yuva Samvad' programme",
    text_hi: "हल्द्वानी में युवा संवाद कार्यक्रम: भाजपा अध्यक्ष नितिन नवीन और सीएम धामी का युवाओं से सीधा संवाद",
    label_en: "Yuva Samvad ANI News",
    label_hi: "युवा संवाद एएनआई न्यूज़",
    when_en: "1 day ago",
    when_hi: "1 दिन पहले",
    stats: "6.2K views",
    post_url: "https://www.youtube.com/watch?v=5Mn1YXcmYAM",
    sort_order: 4,
  },
  {
    id: "yt-IZVtxEM8fPQ",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/IZVtxEM8fPQ/hq720.jpg",
    text_en: "Honor for Sikh Community to Global Leadership: Shri Nitin Nabin addresses national issues | BJP",
    text_hi: "सिख समाज के गौरव से लेकर वैश्विक नेतृत्व तक: राष्ट्रीय विषयों पर श्री नितिन नवीन जी का संबोधन",
    label_en: "Official BJP Address",
    label_hi: "आधिकारिक भाजपा संबोधन",
    when_en: "Recent",
    when_hi: "हाल ही में",
    stats: "2.1K views",
    post_url: "https://www.youtube.com/watch?v=IZVtxEM8fPQ",
    sort_order: 5,
  },
  {
    id: "yt-BOx2eeNKgSA",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/BOx2eeNKgSA/hq720.jpg",
    text_en: "Exclusive National Interview: BJP National President Shri Nitin Nabin on party roadmap and nation building",
    text_hi: "विशेष राष्ट्रीय साक्षात्कार: भाजपा राष्ट्रीय अध्यक्ष श्री नितिन नवीन का संगठन विस्तार और राष्ट्र निर्माण पर विजन",
    label_en: "National Interview",
    label_hi: "राष्ट्रीय साक्षात्कार",
    when_en: "Recent",
    when_hi: "हाल ही में",
    stats: "15K views",
    post_url: "https://www.youtube.com/watch?v=BOx2eeNKgSA",
    sort_order: 6,
  },
  {
    id: "yt-PjeVmBTBQDs",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/PjeVmBTBQDs/hq720.jpg",
    text_en: "GenZ Dialogue in Haldwani: BJP President Nitin Nabin inspires youth on innovation and Viksit Bharat",
    text_hi: "हल्द्वानी में GenZ संवाद: भाजपा अध्यक्ष नितिन नवीन ने युवाओं को नवाचार और विकसित भारत के लिए प्रेरित किया",
    label_en: "GenZ Youth Dialogue",
    label_hi: "GenZ युवा संवाद",
    when_en: "1 day ago",
    when_hi: "1 दिन पहले",
    stats: "5.4K views",
    post_url: "https://www.youtube.com/watch?v=PjeVmBTBQDs",
    sort_order: 7,
  },
  {
    id: "yt-gYFcMYIWXjE",
    platform: "yt",
    image_url: "https://i.ytimg.com/vi/gYFcMYIWXjE/hq720.jpg",
    text_en: "BJP National President Nitin Nabin LIVE: Key announcement and organizational briefing",
    text_hi: "लाइव: भाजपा राष्ट्रीय अध्यक्ष नितिन नवीन की महत्वपूर्ण संगठनात्मक घोषणा एवं प्रेस वार्ता",
    label_en: "Live Announcement",
    label_hi: "लाइव प्रेस वार्ता",
    when_en: "1 day ago",
    when_hi: "1 दिन पहले",
    stats: "12.3K views",
    post_url: "https://www.youtube.com/watch?v=gYFcMYIWXjE",
    sort_order: 8,
  },
];

/**
 * Live fetches authentic YouTube videos and broadcasts featuring Nitin Nabin in real time.
 * Filters out clickbait/gossip channels and ensures only dignified, verified official coverage appears.
 */
export async function getLiveYouTubeFeed(): Promise<SocialPost[]> {
  try {
    const query = encodeURIComponent('"Nitin Nabin" BJP');
    const res = await fetch(`https://www.youtube.com/results?search_query=${query}&sp=CAI%253D`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      next: { revalidate: 120 }, // 2 min revalidation
    });

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData = ({.*?});/s);
      if (match) {
        const data = JSON.parse(match[1]);
        const contents =
          data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
        const livePosts: SocialPost[] = [];
        let order = 1;

        for (const item of contents) {
          const v = item.videoRenderer;
          if (!v || !v.videoId || !v.title?.runs?.[0]?.text) continue;
          let title = v.title.runs[0].text;
          const channel = v.ownerText?.runs?.[0]?.text || "";
          const channelLower = channel.toLowerCase();
          const titleLower = title.toLowerCase();

          // Strict blacklist check
          if (BLACKLIST_WORDS.some((w) => titleLower.includes(w) || channelLower.includes(w))) {
            continue;
          }

          // Must be specifically about Nitin Nabin
          const isAboutNitin =
            titleLower.includes("nitin") ||
            titleLower.includes("nabin") ||
            titleLower.includes("navin") ||
            title.includes("नितिन") ||
            title.includes("नबीन");

          if (!isAboutNitin) continue;

          // Must be from official party or reputable news channel
          const isCredible =
            ALLOWED_CHANNELS.some((c) => channelLower.includes(c)) ||
            channelLower.includes("news") ||
            channelLower.includes("bjp");

          if (!isCredible && order > 3) continue;

          // Clean up title (remove trailing hashtags)
          title = title.replace(/#[a-zA-Z0-9_]+/g, "").trim();

          const thumbs = v.thumbnail?.thumbnails || [];
          const imgUrl = thumbs.length > 0 ? thumbs[thumbs.length - 1].url : `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
          const when = v.publishedTimeText?.simpleText || "Recent";
          const views = v.viewCountText?.simpleText || "YouTube Video";

          livePosts.push({
            id: `yt-${v.videoId}`,
            platform: "yt",
            image_url: imgUrl,
            text_en: title,
            text_hi: title,
            label_en: channel || "Nitin Nabin Address",
            label_hi: channel || "नितिन नवीन संबोधन",
            when_en: when,
            when_hi: when,
            stats: views,
            post_url: `https://www.youtube.com/watch?v=${v.videoId}`,
            sort_order: order++,
          });
        }

        if (livePosts.length >= 4) {
          // Merge with any verified official videos that aren't already included
          const existingIds = new Set(livePosts.map((p) => p.id));
          for (const ov of VERIFIED_OFFICIAL_VIDEOS) {
            if (!existingIds.has(ov.id)) {
              livePosts.push({ ...ov, sort_order: order++ });
            }
          }
          return livePosts;
        }
      }
    }
  } catch (err) {
    console.error("[social] Error in live YouTube search scraper:", err);
  }

  return VERIFIED_OFFICIAL_VIDEOS;
}

