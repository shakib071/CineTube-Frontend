import MediaGrid from "@/components/modules/media/MediaGrid";

export const metadata = {
  title: "All Media — CineTube",
  description: "Browse all movies and series on CineTube",
};

export default function AllMediaPage() {
  return (
    <MediaGrid
      title="All Media"
      subtitle="Browse our complete collection of movies and series"
      defaultSort="createdAt_desc"
    />
  );
}
