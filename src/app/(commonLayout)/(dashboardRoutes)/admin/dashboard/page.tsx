import {
  Film, Users, MessageSquare, DollarSign,
  Mail, Crown, Clock, TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminStatsAction, getNewsletterSubscribersAction } from "./_action";
import RevenueChart from "@/components/modules/admin/RevenueChart";


export const metadata = { title: "Admin Dashboard — CineTube" };

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function AdminDashboardPage() {
  const [statsRes, newsletterRes] = await Promise.all([
    getAdminStatsAction(),
    getNewsletterSubscribersAction(),
  ]);

  const stats = statsRes.success ? statsRes.data : null;
  const newsletter = newsletterRes.success ? newsletterRes.data : null;
  console.log("Admin stats:", statsRes);
  console.log("Newsletter subscribers:", newsletter);

  const statCards = stats
    ? [
        {
          title: "Total Users",
          value: fmt(stats.users.total),
          sub: `${fmt(stats.users.active)} active`,
          icon: Users,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          title: "Total Media",
          value: fmt(stats.media.total),
          sub: `${stats.media.movies} movies · ${stats.media.series} series`,
          icon: Film,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
        },
        {
          title: "Total Revenue",
          value: fmtMoney(stats.revenue.total),
          sub: `${fmt(stats.subscriptions.active)} active subs`,
          icon: DollarSign,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          title: "Reviews",
          value: fmt(stats.reviews.total),
          sub: `${fmt(stats.reviews.pending)} pending`,
          icon: MessageSquare,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
        {
          title: "Newsletter",
          value: fmt(stats.newsletter.totalSubscribers),
          sub: "email subscribers",
          icon: Mail,
          color: "text-red-500",
          bg: "bg-red-500/10",
        },
        {
          title: "Active Subscriptions",
          value: fmt(stats.subscriptions.active),
          sub: "paying members",
          icon: Crown,
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
        },
      ]
    : [];

  const TYPE_LABELS: Record<string, string> = {
    BUY: "Buy", RENT: "Rent", SUBSCRIPTION: "Subscription",
  };
  const STATUS_COLORS: Record<string, string> = {
    SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    FAILED:  "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          CineTube admin overview — users, revenue, and content at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ title, value, sub, icon: Icon, color, bg }) => (
          <Card key={title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart + recent purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue chart — client component */}
        <Card className="lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Revenue overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentPurchases ? (
              <RevenueChart purchases={stats.recentPurchases} />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Recent purchases */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Recent purchases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.recentPurchases?.length ? (
              stats.recentPurchases.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.user?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {p.media?.title ?? "Subscription"} · {TYPE_LABELS[p.type] ?? p.type}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{fmtDate(p.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-semibold text-foreground">
                      ${p.amount.toFixed(2)}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 ${STATUS_COLORS[p.status] ?? ""}`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No purchases yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Media breakdown */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Movies", value: stats.media.movies, total: stats.media.total, color: "bg-purple-500" },
            { label: "Series", value: stats.media.series, total: stats.media.total, color: "bg-blue-500" },
            { label: "Approved reviews", value: stats.reviews.approved, total: stats.reviews.total, color: "bg-emerald-500" },
          ].map(({ label, value, total, color }) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <Card key={label} className="border-border/50">
                <CardContent className="pt-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-foreground">{value} <span className="text-xs text-muted-foreground font-normal">/ {total}</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{pct}% of total</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Newsletter subscribers */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-500" />
            Newsletter subscribers
            {newsletter && (
              <Badge variant="secondary" className="text-xs ml-1">{newsletter.total}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {newsletter?.subscribers?.length ? (
            <div className="divide-y divide-border/50">
              {newsletter.subscribers.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <span className="text-sm text-foreground">{s.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{fmtDate(s.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No subscribers yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
