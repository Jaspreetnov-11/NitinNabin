async function testTwitter() {
  console.log('--- Testing Twitter Syndication ---');
  try {
    const res = await fetch('https://syndication.twitter.com/srv/timeline-profile/screen-name/NitinNabin', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    console.log('Twitter syndication status:', res.status);
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
    if (match) {
      const data = JSON.parse(match[1]);
      const entries = data.props?.pageProps?.timeline?.entries || [];
      console.log('Twitter entries found:', entries.length);
      if (entries.length > 0) {
        const item = entries[0];
        console.log('First tweet:', JSON.stringify(item.content?.tweet?.full_text || item.content?.tweet?.text || item, null, 2));
      }
    } else {
      console.log('No __NEXT_DATA__ in twitter response');
    }
  } catch (err) {
    console.error('Twitter err:', err.message);
  }
}

async function testNitter() {
  console.log('--- Testing Nitter / RSS ---');
  const nitterHosts = ['nitter.net', 'nitter.poast.org', 'nitter.woodpecker.fi'];
  for (const host of nitterHosts) {
    try {
      const res = await fetch(`https://${host}/NitinNabin/rss`, { signal: AbortSignal.timeout(4000) });
      console.log(`${host} status:`, res.status);
      if (res.ok) {
        const text = await res.text();
        console.log(`${host} RSS preview:`, text.slice(0, 200));
        break;
      }
    } catch (e) {
      console.log(`${host} failed:`, e.message);
    }
  }
}

async function testYouTube() {
  console.log('--- Testing YouTube Official Nitin Nabin ---');
  // BJP4India channel videos filtered by Nitin Nabin or Nitin Nabin search
  try {
    const res = await fetch('https://www.youtube.com/results?search_query=%22Nitin+Nabin%22+BJP&sp=CAI%253D', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });
    console.log('YouTube search status:', res.status);
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (match) {
      const data = JSON.parse(match[1]);
      const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
      console.log('Raw search contents found:', contents.length);
      const filtered = [];
      for (const item of contents) {
        const v = item.videoRenderer;
        if (!v) continue;
        const title = v.title?.runs?.[0]?.text || '';
        const channel = v.ownerText?.runs?.[0]?.text || '';
        const thumbs = v.thumbnail?.thumbnails || [];
        const thumb = thumbs[thumbs.length - 1]?.url || '';
        filtered.push({ title, channel, thumb, id: v.videoId });
      }
      console.log('Sample videos:');
      console.log(filtered.slice(0, 5));
    }
  } catch (e) {
    console.log('YouTube error:', e.message);
  }
}

async function testInstagram() {
  console.log('--- Testing Instagram embed/oembed ---');
  try {
    const res = await fetch('https://www.instagram.com/nitinnabinbjp/?__a=1&__d=dis', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    console.log('Instagram status:', res.status);
  } catch (e) {
    console.log('Instagram err:', e.message);
  }
}

async function run() {
  await testTwitter();
  await testNitter();
  await testYouTube();
  await testInstagram();
}

run();
