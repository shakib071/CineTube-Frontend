import MediaGrid from "@/components/modules/media/MediaGrid";

export const metadata = {
  title: "Movies — CineTube",
  description: "Browse all movies on CineTube",
};

export default function MoviesPage() {
  return (
    <MediaGrid
      type="MOVIE"
      title="Movies"
      subtitle="Browse our full collection of films"
      defaultSort="createdAt_desc"
    />
  );
}
