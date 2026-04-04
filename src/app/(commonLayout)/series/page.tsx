import MediaGrid from "@/components/modules/media/MediaGrid";

export const metadata = {
  title: "Series — CineTube",
  description: "Browse all TV series on CineTube",
};

export default function SeriesPage() {
  return (
    <MediaGrid
      type="SERIES"
      title="Series"
      subtitle="Discover binge-worthy TV shows and web series"
      defaultSort="createdAt_desc"
    />
  );
}

