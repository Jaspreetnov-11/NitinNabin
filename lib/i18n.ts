// Static UI strings and biographical copy (EN / HI).
// Dynamic content (updates, milestones, gallery, social posts) lives in Supabase.
import type { Lang, Platform, SocialTab } from "./types";

type SocialProfile = { label: string; who: string; sub: string; btn: string; url: string };

const en = {
  name: "Nitin Nabin", first: "Nitin", last: "Nabin",
  role: "National President, Bharatiya Janata Party", role_1: "National President", role_2: "Bharatiya Janata Party", role_short: "National President, BJP",
  n_home: "Home", n_about: "About", n_journey: "Journey", n_work: "Work", n_updates: "Updates", n_media: "Media", n_contact: "Contact",
  hero_p: "A journey shaped by public trust, organisational work and a steady commitment to service.",
  cta1: "See the journey", cta2: "Latest updates",
  stats: [["20", "years in public life", "since 2006"], ["05", "Assembly terms", "Patna West · Bankipur"], ["03", "ministerial portfolios", "Government of Bihar"], ["01", "National President", "since 20 January 2026"]] as [string, string, string][],
  about_eb: "02 — Introduction", about_h: ["A Life in", "Public Service"] as [string, string],
  facts: [["Born", "23 May 1980, Ranchi"], ["Constituency", "Bankipur, Patna"], ["Assembly terms", "Five (2006, 2010, 2015, 2020, 2025)"], ["Education", "Intermediate (Class 12)"], ["Portfolios", "Road Construction; Urban Development & Housing; Law & Justice"], ["Current post", "National President, since 20 January 2026"]] as [string, string][],
  bio: [
    "Nitin Nabin entered electoral politics in 2006, when the Patna West seat fell vacant after the passing of his father, four-term MLA Nabin Kishore Prasad Sinha. He was twenty-six.",
    "Patna West was redrawn as Bankipur before the 2010 election. He contested and won there, and has been elected in every Assembly election since — 2010, 2015, 2020 and 2025. In 2025 he polled 98,299 votes and won by a margin of 51,936.",
    "Alongside legislative work he built long organisational experience: Bihar state president of the Bharatiya Janata Yuva Morcha, national general secretary of the Yuva Morcha, and party in-charge for Sikkim and Chhattisgarh. In the Nitish Kumar-led Bihar government he held Road Construction, Urban Development & Housing, and Law & Justice.",
    "In December 2025 the Parliamentary Board appointed him National Working President — the youngest in the party's history and the first from Bihar — and he resigned from the Bihar cabinet. On 20 January 2026 he was elected National President unopposed at the party headquarters in New Delhi.",
  ],
  bio_more: "Read full biography →",
  read_more: "Read more ↓", show_less: "Show less ↑", show_pos: "Show all positions ↓",
  jr_h: "Journey", jr_p: "From a Patna by-election to the party presidency — twenty years in public life. Pick a year to see the details.", record: "Record",
  four_eb: "04 — Responsibilities", four_h: ["Four", "Fields", "of Work"] as [string, string, string],
  four_p: "One public journey, expressed through four distinct arenas — constituency, government, organisation and national leadership.",
  four: [
    ["Electoral", "Political Leadership", "Five consecutive terms in the Bihar Assembly — Patna West in 2006, then Bankipur in 2010, 2015, 2020 and 2025.", "05 Assembly terms"],
    ["Government", "Governance", "Cabinet Minister in the Government of Bihar — Road Construction, Urban Development & Housing, and Law & Justice.", "03 Portfolios held"],
    ["Party", "Organisation", "Bihar state president and national general secretary of the Bharatiya Janata Yuva Morcha; party in-charge for Sikkim and Chhattisgarh.", "02 State assignments"],
    ["National", "National Leadership", "Appointed National Working President in December 2025 and elected National President on 20 January 2026 — the youngest, and the first from Bihar.", "2026 Elected 20 January, New Delhi"],
  ] as [string, string, string, string][],
  rec_h: "Leadership record", rec_p: "Twenty years representing the same part of Patna — first Patna West, then Bankipur — across five consecutive elections.",
  recl: [["2006", "Patna West by-election, won by about 60,000 votes"], ["2010", "First win from the newly formed Bankipur seat"], ["2015", "Third consecutive term"], ["2020", "Fourth term, margin of 39,036 votes"], ["2025", "98,299 votes; fifth term by a margin of 51,936"]] as [string, string][],
  pos_h: "Positions held", pos_p: "Every entry is dated and drawn from the public record.",
  pos: [["2006 – 2010", "Member, Bihar Legislative Assembly", "Patna West"], ["2010 – present", "Member, Bihar Legislative Assembly", "Bankipur"], ["until 2019", "State President, Bharatiya Janata Yuva Morcha", "Bihar unit"], ["Feb 2021 – Aug 2022", "Minister, Road Construction", "Government of Bihar"], ["2023", "Election in-charge, Chhattisgarh", "Party organisation"], ["Mar 2024 – Feb 2025", "Minister, Law & Justice", "Government of Bihar"], ["2024 – Dec 2025", "Minister, Urban Development & Housing; Road Construction", "Government of Bihar"], ["Dec 2025 – Jan 2026", "National Working President", "Bharatiya Janata Party"], ["since January 2026", "National President", "Bharatiya Janata Party"]] as [string, string, string][],
  upd_h: "Latest updates", art_p: "Recent engagements and statements — hover to pause.",
  gal_h: "Photo record",
  nl_h: "From Bankipur to the national organisation",
  nl: [
    ["01 · Constituency", "Bihar", "2006 — 2025", "Twenty years representing the same part of Patna, first as Patna West and then as Bankipur, across five consecutive elections."],
    ["02 · Organisation", "Party organisation", "2010s — 2023", "Yuva Morcha leadership at state and national level, then state responsibilities — in-charge for Sikkim and the 2023 Chhattisgarh campaign."],
    ["03 · National", "National President", "2025 — present", "National Working President in December 2025; elected National President on 20 January 2026 — the first party president from Bihar."],
  ] as [string, string, string, string][],
  soc_h: "Official social media feed", post_of: (a: number, b: number) => `Post ${a} of ${b}`, view_on: "View on",
  ct_h: "Connect", ct_p: "Verified updates only on official social media. Use the links below to reach the office.",
  f_sections: "Sections", f_sources: "Sources", f_policy: "Verification policy",
  f_policy1: "Every fact here is drawn from the listed public sources. Where a detail could not be confirmed from the public record, it has been left out rather than guessed.",
  f_copy: "© 2026. Informational public-profile site. Not an official party publication.", f_a11y: "Accessibility", f_privacy: "Privacy", f_corr: "Corrections",
  social: {
    all: { label: "All Feeds", who: "Nitin Nabin", sub: "Live social media updates", btn: "View Profiles", url: "#contact" },
    fb: { label: "Facebook", who: "Nitin Nabin", sub: "1,240,890 followers", btn: "Follow Page", url: "https://www.facebook.com/NitinNabinBJP/" },
    x: { label: "X", who: "Nitin Nabin", sub: "@NitinNabin", btn: "Follow", url: "https://x.com/NitinNabin" },
    ig: { label: "Instagram", who: "nitinnabinbjp", sub: "842 posts · 480K", btn: "Follow", url: "https://www.instagram.com/nitinnabinbjp/" },
    yt: { label: "YouTube", who: "Nitin Nabin / BJP Official", sub: "Speeches & Live Broadcasts", btn: "Subscribe", url: "https://www.youtube.com/@BJP4India" },
  } as Record<SocialTab, SocialProfile>,
};

export type Strings = typeof en;

const hi: Strings = {
  name: "नितिन नबीन", first: "नितिन", last: "नबीन",
  role: "राष्ट्रीय अध्यक्ष, भारतीय जनता पार्टी", role_1: "राष्ट्रीय अध्यक्ष", role_2: "भारतीय जनता पार्टी", role_short: "राष्ट्रीय अध्यक्ष, भाजपा",
  n_home: "होम", n_about: "परिचय", n_journey: "यात्रा", n_work: "कार्य", n_updates: "अपडेट", n_media: "मीडिया", n_contact: "संपर्क",
  hero_p: "जनविश्वास, संगठनात्मक कार्य और सेवा के प्रति निरंतर प्रतिबद्धता से आकार लेती एक यात्रा।",
  cta1: "यात्रा देखें", cta2: "नवीनतम अपडेट",
  stats: [["20", "वर्ष सार्वजनिक जीवन", "2006 से"], ["05", "विधानसभा कार्यकाल", "पटना पश्चिम · बांकीपुर"], ["03", "मंत्री विभाग", "बिहार सरकार"], ["01", "राष्ट्रीय अध्यक्ष", "20 जनवरी 2026 से"]],
  about_eb: "02 — परिचय", about_h: ["सार्वजनिक", "जीवन की यात्रा"],
  facts: [["जन्म", "23 मई 1980, राँची"], ["निर्वाचन क्षेत्र", "बांकीपुर, पटना"], ["विधानसभा कार्यकाल", "पाँच (2006, 2010, 2015, 2020, 2025)"], ["शिक्षा", "इंटरमीडिएट (कक्षा 12)"], ["मंत्री विभाग", "पथ निर्माण; नगर विकास एवं आवास; विधि एवं न्याय"], ["वर्तमान पद", "राष्ट्रीय अध्यक्ष, 20 जनवरी 2026 से"]],
  bio: [
    "नितिन नबीन ने 2006 में चुनावी राजनीति में प्रवेश किया, जब उनके पिता और उसी क्षेत्र से चार बार विधायक रहे नबीन किशोर प्रसाद सिन्हा के निधन के बाद पटना पश्चिम सीट पर उपचुनाव हुआ। उस समय उनकी आयु छब्बीस वर्ष थी।",
    "2010 के चुनाव से पहले पटना पश्चिम का पुनर्गठन बांकीपुर के रूप में हुआ। उन्होंने वहाँ से चुनाव लड़ा और जीते, और तब से हर विधानसभा चुनाव — 2010, 2015, 2020 और 2025 — में निर्वाचित हुए हैं। 2025 के चुनाव में उन्हें 98,299 मत मिले और 51,936 मतों के अंतर से जीत दर्ज की।",
    "विधायी कार्य के साथ-साथ उन्होंने संगठन में लंबा अनुभव अर्जित किया: भारतीय जनता युवा मोर्चा के बिहार प्रदेश अध्यक्ष, युवा मोर्चा के राष्ट्रीय महामंत्री, तथा सिक्किम और छत्तीसगढ़ के प्रभारी। नीतीश कुमार के नेतृत्व वाली बिहार सरकार में उन्होंने पथ निर्माण, नगर विकास एवं आवास तथा विधि एवं न्याय विभाग सँभाले।",
    "दिसंबर 2025 में पार्टी के संसदीय बोर्ड ने उन्हें राष्ट्रीय कार्यकारी अध्यक्ष नियुक्त किया — पार्टी के इतिहास में सबसे युवा और बिहार से पहले — और उन्होंने बिहार मंत्रिमंडल से इस्तीफा दे दिया। 20 जनवरी 2026 को नई दिल्ली स्थित पार्टी मुख्यालय में वे निर्विरोध राष्ट्रीय अध्यक्ष निर्वाचित हुए।",
  ],
  bio_more: "पूरी जीवनी पढ़ें →",
  read_more: "और पढ़ें ↓", show_less: "कम दिखाएँ ↑", show_pos: "सभी पद ↓",
  jr_h: "यात्रा", jr_p: "पटना के एक उपचुनाव से राष्ट्रीय अध्यक्ष पद तक, बीस वर्षों का सार्वजनिक जीवन। विवरण देखने के लिए वर्ष चुनें।", record: "अभिलेख",
  four_eb: "04 — दायित्व · एक यात्रा, चार क्षेत्र", four_h: ["कार्य के", "चार", "क्षेत्र"],
  four_p: "एक सार्वजनिक यात्रा, चार भिन्न क्षेत्रों में अभिव्यक्त — निर्वाचन क्षेत्र, सरकार, संगठन और राष्ट्रीय नेतृत्व।",
  four: [
    ["चुनावी", "राजनीतिक नेतृत्व", "बिहार विधानसभा में लगातार पाँच कार्यकाल — 2006 में पटना पश्चिम, फिर 2010, 2015, 2020 और 2025 में बांकीपुर।", "05 विधानसभा कार्यकाल"],
    ["सरकार", "शासन", "बिहार सरकार में कैबिनेट मंत्री — पथ निर्माण, नगर विकास एवं आवास, तथा विधि एवं न्याय।", "03 मंत्री विभाग"],
    ["पार्टी", "संगठन", "भारतीय जनता युवा मोर्चा के बिहार प्रदेश अध्यक्ष और राष्ट्रीय महामंत्री; सिक्किम और छत्तीसगढ़ के प्रभारी।", "02 राज्य प्रभार"],
    ["राष्ट्रीय", "राष्ट्रीय नेतृत्व", "दिसंबर 2025 में राष्ट्रीय कार्यकारी अध्यक्ष नियुक्त और 20 जनवरी 2026 को राष्ट्रीय अध्यक्ष निर्वाचित — इस पद पर सबसे युवा और बिहार से पहले।", "2026 निर्वाचित 20 जनवरी, नई दिल्ली"],
  ],
  rec_h: "पूरा नेतृत्व अभिलेख", rec_p: "पटना के एक ही हिस्से का बीस वर्षों तक प्रतिनिधित्व — पहले पटना पश्चिम, फिर बांकीपुर — लगातार पाँच चुनावों में।",
  recl: [["2006", "पटना पश्चिम उपचुनाव, लगभग 60,000 मतों से जीत"], ["2010", "नवगठित बांकीपुर सीट से पहली जीत"], ["2015", "लगातार तीसरा कार्यकाल"], ["2020", "39,036 मतों के अंतर से चौथा कार्यकाल"], ["2025", "98,299 मत; 51,936 मतों के अंतर से पाँचवाँ कार्यकाल"]],
  pos_h: "पद एवं दायित्व", pos_p: "प्रत्येक प्रविष्टि सार्वजनिक अभिलेख से ली गई और तिथिबद्ध है।",
  pos: [["2006 – 2010", "सदस्य, बिहार विधानसभा", "पटना पश्चिम"], ["2010 – वर्तमान", "सदस्य, बिहार विधानसभा", "बांकीपुर"], ["2019 तक", "प्रदेश अध्यक्ष, भारतीय जनता युवा मोर्चा", "बिहार इकाई"], ["फ़र 2021 – अग 2022", "पथ निर्माण मंत्री", "बिहार सरकार"], ["2023", "चुनाव प्रभारी, छत्तीसगढ़", "पार्टी संगठन"], ["मार्च 2024 – फ़र 2025", "विधि एवं न्याय मंत्री", "बिहार सरकार"], ["2024 – दिस 2025", "नगर विकास एवं आवास; पथ निर्माण मंत्री", "बिहार सरकार"], ["दिस 2025 – जन 2026", "राष्ट्रीय कार्यकारी अध्यक्ष", "भारतीय जनता पार्टी"], ["जनवरी 2026 से", "राष्ट्रीय अध्यक्ष", "भारतीय जनता पार्टी"]],
  upd_h: "नवीनतम अपडेट", art_p: "हाल की गतिविधियाँ और वक्तव्य।",
  gal_h: "चित्र अभिलेख",
  nl_h: "बांकीपुर से राष्ट्रीय संगठन तक",
  nl: [
    ["01 · निर्वाचन क्षेत्र", "बिहार", "2006 — 2025", "पटना के एक ही हिस्से का बीस वर्षों तक प्रतिनिधित्व, पहले पटना पश्चिम और फिर बांकीपुर के रूप में, लगातार पाँच चुनावों में।"],
    ["02 · संगठन", "पार्टी संगठन", "2010s — 2023", "बिहार और राष्ट्रीय स्तर पर युवा मोर्चा का नेतृत्व, फिर राज्य दायित्व — सिक्किम प्रभारी और 2023 का छत्तीसगढ़ अभियान।"],
    ["03 · राष्ट्रीय", "राष्ट्रीय अध्यक्ष", "2025 — वर्तमान", "दिसंबर 2025 में राष्ट्रीय कार्यकारी अध्यक्ष; 20 जनवरी 2026 को राष्ट्रीय अध्यक्ष निर्वाचित — बिहार से पहले पार्टी अध्यक्ष।"],
  ],
  soc_h: "आधिकारिक सोशल मीडिया फ़ीड", post_of: (a, b) => `पोस्ट ${a} / ${b}`, view_on: "देखें:",
  ct_h: "जुड़िए", ct_p: "सत्यापित अपडेट सिर्फ़ आधिकारिक सोशल मीडिया पर। कार्यालय से संपर्क के लिए नीचे लिंक देखें।",
  f_sections: "अनुभाग", f_sources: "स्रोत", f_policy: "सत्यापन नीति",
  f_policy1: "यहाँ दिया गया प्रत्येक तथ्य सूचीबद्ध सार्वजनिक स्रोतों से लिया गया है। जिस विवरण की पुष्टि सार्वजनिक अभिलेख से नहीं हो सकी, उसे अनुमान लगाने के बजाय छोड़ दिया गया है।",
  f_copy: "© 2026. सूचनात्मक सार्वजनिक-प्रोफ़ाइल साइट। यह पार्टी का आधिकारिक प्रकाशन नहीं है।", f_a11y: "सुगम्यता", f_privacy: "गोपनीयता", f_corr: "संशोधन",
  social: {
    all: { label: "सभी फ़ीड", who: "नितिन नबीन", sub: "लाइव सोशल मीडिया अपडेट", btn: "प्रोफ़ाइल देखें", url: "#contact" },
    fb: { label: "Facebook", who: "नितिन नबीन", sub: "1,240,890 फॉलोअर्स", btn: "पेज फ़ॉलो करें", url: "https://www.facebook.com/NitinNabinBJP/" },
    x: { label: "X", who: "नितिन नबीन", sub: "@NitinNabin", btn: "फ़ॉलो करें", url: "https://x.com/NitinNabin" },
    ig: { label: "Instagram", who: "nitinnabinbjp", sub: "842 पोस्ट · 480K", btn: "फ़ॉलो करें", url: "https://www.instagram.com/nitinnabinbjp/" },
    yt: { label: "YouTube", who: "नितिन नबीन / भाजपा आधिकारिक", sub: "संबोधन एवं लाइव अपडेट", btn: "सब्सक्राइब", url: "https://www.youtube.com/@BJP4India" },
  },
};

export const STRINGS: Record<Lang, Strings> = { en, hi };
export const PLATFORMS: SocialTab[] = ["all", "fb", "x", "ig", "yt"];
