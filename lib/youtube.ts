export const NAREENA_YOUTUBE_CHANNEL_URL =
  "https://youtube.com/@nareenafractal?si=CfWCP6EGiMkiAQra";

export type YoutubeChannelPreview = {
  channelTitle: string;
  description: string;
  channelUrl: string;
  channelThumbUrl?: string;
  latestVideoTitle?: string;
  latestVideoThumb?: string;
  latestVideoUrl?: string;
};

export const YOUTUBE_CHANNEL_FALLBACK: YoutubeChannelPreview = {
  channelTitle: "Nareena Fractal",
  description:
    "Videos on the Nareena fractal, visual explorations, and related mathematics.",
  channelUrl: NAREENA_YOUTUBE_CHANNEL_URL,
};

/**
 * Optional YouTube Data API enrichment when `YOUTUBE_API_KEY` and
 * `YOUTUBE_CHANNEL_ID` are set; otherwise returns the public channel fallback.
 */
export async function getYoutubeChannelPreview(): Promise<YoutubeChannelPreview> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const channelUrl =
    process.env.YOUTUBE_CHANNEL_PUBLIC_URL?.trim() || NAREENA_YOUTUBE_CHANNEL_URL;

  if (!apiKey?.trim() || !channelId?.trim()) {
    return { ...YOUTUBE_CHANNEL_FALLBACK, channelUrl };
  }

  try {
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 3600 } },
    );
    if (!chRes.ok) return { ...YOUTUBE_CHANNEL_FALLBACK, channelUrl };

    const chJson = (await chRes.json()) as {
      items?: {
        snippet?: {
          title?: string;
          description?: string;
          thumbnails?: Record<string, { url?: string }>;
        };
      }[];
    };
    const item = chJson.items?.[0];
    const snippets = item?.snippet;
    const title = snippets?.title?.trim();
    if (!title || !snippets) {
      return { ...YOUTUBE_CHANNEL_FALLBACK, channelUrl };
    }

    const channelThumbUrl =
      snippets.thumbnails?.high?.url ||
      snippets.thumbnails?.medium?.url ||
      snippets.thumbnails?.default?.url;

    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&type=video&key=${apiKey}`,
      { next: { revalidate: 1800 } },
    );

    let latestVideoTitle: string | undefined;
    let latestVideoThumb: string | undefined;
    let latestVideoUrl: string | undefined;

    if (searchRes.ok) {
      const sJson = (await searchRes.json()) as {
        items?: {
          id?: { videoId?: string };
          snippet?: {
            title?: string;
            thumbnails?: Record<string, { url?: string }>;
          };
        }[];
      };
      const v = sJson.items?.[0];
      const vid = v?.id?.videoId;
      if (vid) {
        latestVideoUrl = `https://www.youtube.com/watch?v=${vid}`;
        latestVideoTitle = v?.snippet?.title;
        latestVideoThumb =
          v?.snippet?.thumbnails?.high?.url ||
          v?.snippet?.thumbnails?.medium?.url ||
          v?.snippet?.thumbnails?.default?.url;
      }
    }

    return {
      channelTitle: title,
      description: (snippets.description || YOUTUBE_CHANNEL_FALLBACK.description).slice(
        0,
        220,
      ),
      channelUrl,
      channelThumbUrl,
      latestVideoTitle,
      latestVideoThumb,
      latestVideoUrl,
    };
  } catch {
    return { ...YOUTUBE_CHANNEL_FALLBACK, channelUrl };
  }
}
