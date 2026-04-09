import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import MediaCard from "@/components/modules/media/MediaCard";
import { getTopRatedAction } from "@/app/(commonLayout)/_action";


export default async function TopRatedSection() {
  const media = await getTopRatedAction();
  if (media.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-foreground">Top Rated</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Highest-rated titles across all genres
          </p>
        </div>
        <Link
          href="/top-rated"
          className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {media.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </section>
  );
}
