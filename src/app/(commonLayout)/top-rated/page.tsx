import MediaGrid from "@/components/modules/media/MediaGrid";

export const metadata = {
  title: "Top Rated — CineTube",
  description: "The highest-rated movies and series on CineTube",
};

export default function TopRatedPage() {
  return (
    <MediaGrid
      title="Top Rated"
      subtitle="The highest-rated titles across all genres"
      defaultSort="averageRating_desc"
      showRank
    />
  );
}
