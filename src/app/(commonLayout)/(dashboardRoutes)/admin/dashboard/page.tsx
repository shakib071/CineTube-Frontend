import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, MessageSquare, Star } from "lucide-react";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
};

async function fetchStats() {
  try {
    const cookieHeader = await getCookieHeader();

    const [mediaRes, usersRes, reviewsRes] = await Promise.all([
      fetch(`${API}/media?limit=1&isPublished=true`, { headers: { Cookie: cookieHeader }, cache: "no-store" }),
      fetch(`${API}/admin/users?limit=1`, { headers: { Cookie: cookieHeader }, cache: "no-store" }),
      fetch(`${API}/reviews?limit=1`, { headers: { Cookie: cookieHeader }, cache: "no-store" }),
    ]);

    const [mediaData, usersData, reviewsData] = await Promise.all([
      mediaRes.json(), usersRes.json(), reviewsRes.json(),
    ]);

    // Fetch average rating across all approved reviews
    const allReviewsRes = await fetch(`${API}/reviews?limit=1000&status=APPROVED`, {
      headers: { Cookie: cookieHeader }, cache: "no-store",
    });
    const allReviewsData = await allReviewsRes.json();
    const approvedReviews = allReviewsData?.data ?? [];
    const avgRating = approvedReviews.length > 0
      ? (approvedReviews.reduce((sum: number, r: { rating: number }) => sum + Number(r.rating), 0) / approvedReviews.length).toFixed(1)
      : "—";

    return {
      totalMedia: mediaData?.meta?.total ?? 0,
      totalUsers: usersData?.meta?.total ?? 0,
      totalReviews: reviewsData?.meta?.total ?? 0,
      avgRating,
    };
  } catch {
    return { totalMedia: 0, totalUsers: 0, totalReviews: 0, avgRating: "—" };
  }
}

export default async function AdminDashboardPage() {
  const stats = await fetchStats();

  const cards = [
    { title: "Total Media", value: stats.totalMedia, icon: Film, color: "text-blue-500" },
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-green-500" },
    { title: "Total Reviews", value: stats.totalReviews, icon: MessageSquare, color: "text-purple-500" },
    { title: "Avg. Rating", value: stats.avgRating, icon: Star, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the CineTube admin panel. Manage movies, users, and reviews.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className={`w-4 h-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
