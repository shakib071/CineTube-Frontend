import Link from "next/link";
import { Tv } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Tv className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight">
                Cine<span className="text-red-500">Tube</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-50">
              Your ultimate destination for movies and series. Watch, rate, and discover.
            </p>
          </div>

          {/* Browse */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Browse</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/movies" className="hover:text-foreground transition-colors">Movies</Link></li>
              <li><Link href="/series" className="hover:text-foreground transition-colors">Series</Link></li>
              <li><Link href="/top-rated" className="hover:text-foreground transition-colors">Top Rated</Link></li>
              <li><Link href="/all-media" className="hover:text-foreground transition-colors">All Media</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Account</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link></li>
              <li><Link href="/watchlist" className="hover:text-foreground transition-colors">Watchlist</Link></li>
              <li><Link href="/purchase-history" className="hover:text-foreground transition-colors">Purchase History</Link></li>
              <li><Link href="/subscription" className="hover:text-foreground transition-colors">Subscription</Link></li>
            </ul>
          </div>

          {/* Genres */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Genres</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Action", "Drama", "Comedy", "Thriller", "Sci-Fi", "Horror"].map((g) => (
                <li key={g}>
                  <Link
                    href={`/browse-genre/${g.toLowerCase()}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CineTube. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
