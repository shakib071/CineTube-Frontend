
import MediaGrid from "@/components/modules/media/MediaGrid";

export const metadata = {
  title: "genres — CineTube",
  description: "Browse all genres of movies and series on CineTube",
};

export default function BrowseGenrePage() {
  return (
    <MediaGrid
      title="ALL Genres"
      subtitle="Browse our full collection of films across all genres"
      defaultSort="createdAt_desc"
    />
  );
}

