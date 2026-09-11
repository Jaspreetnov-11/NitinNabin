async function testFilteredYouTube() {
  const query = encodeURIComponent('"Nitin Nabin" BJP');
  const res = await fetch(`https://www.youtube.com/results?search_query=${query}&sp=CAI%253D`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7',
    }
  });

  const html = await res.text();
  const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData = ({.*?});/s);
  if (!match) {
    console.log('No match');
    return;
  }

  const data = JSON.parse(match[1]);
  const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

  const blacklistKeywords = [
    'बाप', 'घटिया', 'फंसे', 'फंसी', 'विवादित', 'desperation', 'brawl', 'satya hindi', 'mic check', 'public meter', 'nubt'
  ];

  const allowedChannels = [
    'bharatiya janata party', 'bjp', 'dd news', 'ani news', 'news 24', 'abp news', 'news18', 'zee news', 'punjab kesari', 'sansad tv', 'live hindustan', 'the public india', 'ndtv', 'aaj tak', 'times now', 'republic'
  ];

  const filtered = [];
  for (const item of contents) {
    const v = item.videoRenderer;
    if (!v || !v.videoId) continue;
    const title = v.title?.runs?.[0]?.text || '';
    const channel = v.ownerText?.runs?.[0]?.text || '';
    const channelLower = channel.toLowerCase();
    const titleLower = title.toLowerCase();

    // Check blacklist
    if (blacklistKeywords.some(w => titleLower.includes(w) || channelLower.includes(w))) {
      continue;
    }

    // Must be about Nitin Nabin
    const isAboutNitin = titleLower.includes('nitin') || titleLower.includes('nabin') || titleLower.includes('navin') || title.includes('नितिन') || title.includes('नबीन');
    if (!isAboutNitin) continue;

    // Check channel credibility
    const isCredible = allowedChannels.some(c => channelLower.includes(c)) || channelLower.includes('news') || channelLower.includes('bjp');
    if (!isCredible) continue;

    const thumbs = v.thumbnail?.thumbnails || [];
    const thumb = thumbs.length > 0 ? thumbs[thumbs.length - 1].url : `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
    const views = v.viewCountText?.simpleText || 'YouTube Video';
    const when = v.publishedTimeText?.simpleText || 'Recent';

    filtered.push({
      id: v.videoId,
      title,
      channel,
      views,
      when,
      thumb
    });
  }

  console.log(`Found ${filtered.length} high-quality official Nitin Nabin videos:`);
  console.log(JSON.stringify(filtered, null, 2));
}

testFilteredYouTube();
