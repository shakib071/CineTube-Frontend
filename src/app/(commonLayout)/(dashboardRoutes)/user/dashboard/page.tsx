"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserDashboardStats } from "@/types/stat.types";
import { getUserStatsAction } from "./_action";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";



export default function DashboardHome() {
 
  const { data:statsResponse, isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => getUserStatsAction(),
  });

  const stats = statsResponse?.data as UserDashboardStats;
  // console.log(stats);

  if(isLoading) {
    return (
      <div>
        <p  className="text-center py-16">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {stats?.userName} 👋</CardTitle>
          <CardDescription>Enjoy your movies today!</CardDescription>
        </CardHeader>
      </Card>

      {/* Account Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Watchlist</CardTitle>
          </CardHeader>
          <CardContent>{stats?.watchlistCount}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchases</CardTitle>
          </CardHeader>
          <CardContent>{stats?.purchasesCount}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rentals</CardTitle>
          </CardHeader>
          <CardContent>{stats?.rentalsCount}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>{stats?.reviewsCount}</CardContent>
        </Card>
      </div>

      {/* Subscription Card */}
      {stats?.subscription?.active ? (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Active</CardTitle>
            <CardDescription>
              {stats?.subscription?.planName} - Expires on {stats?.subscription?.expiresAt}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Manage Subscription</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/user/dashboard/subscription")}>Subscribe Now</Button>
          </CardContent>
        </Card>
      )}

      {/* Engagement / Recommendation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Top Rated Movies</CardTitle>
          <CardDescription>Check out the highest rated movies!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => (window.location.href = "/top-rated")}>Go to Top Rated</Button>
        </CardContent>
      </Card>
    </div>
  );
}