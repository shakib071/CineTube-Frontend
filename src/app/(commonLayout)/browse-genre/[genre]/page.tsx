import MediaGrid from "@/components/modules/media/MediaGrid";

interface Props {
  params: Promise<{ genre: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { genre } = await params;
  const label = genre.charAt(0).toUpperCase() + genre.slice(1);
  return {
    title: `${label} — CineTube`,
    description: `Browse all ${label} movies and series on CineTube`,
  };
}

export default async function BrowseGenrePage({ params }: Props) {
  const { genre } = await params;
  const label = genre.charAt(0).toUpperCase() + genre.slice(1);

  return (
    <MediaGrid
      title={label}
      subtitle={`Browsing all ${label} genres `}
      defaultSort="createdAt_desc"
      defaultGenre={label}
    />
  );
}
