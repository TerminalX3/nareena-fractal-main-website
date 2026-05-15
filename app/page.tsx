import { HomePage } from "@/components/home/home-page";
import { getYoutubeChannelPreview } from "@/lib/youtube";
import { loadPapers } from "@/lib/papers";

export default async function Page() {
  const papers = loadPapers()
    .sort((a, b) => b.year - a.year)
    .slice(0, 6);

  const youtube = await getYoutubeChannelPreview();

  return <HomePage papers={papers} youtube={youtube} />;
}
