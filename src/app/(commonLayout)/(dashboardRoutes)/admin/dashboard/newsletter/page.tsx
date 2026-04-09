import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNewsletterSubscribersAction } from "../_action";

export const metadata = { title: "Newsletter — Admin CineTube" };

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

export default async function AdminNewsletterPage() {
  const res = await getNewsletterSubscribersAction();
  const data = res.success ? res.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Newsletter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All email addresses subscribed to the CineTube newsletter.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-500" />
            Subscribers
            <Badge variant="secondary" className="text-xs ml-1">
              {data?.total ?? 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.subscribers?.length ? (
            <div className="divide-y divide-border/50">
              {/* Header row */}
              <div className="flex items-center justify-between pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Email</span>
                <span>Subscribed on</span>
              </div>

              {data.subscribers.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-3 gap-4"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 text-xs font-semibold text-red-500">
                      {i + 1}
                    </div>
                    <span className="text-sm text-foreground truncate">{s.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {fmtDate(s.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground">No subscribers yet</p>
              <p className="text-xs text-center max-w-xs">
                Add a newsletter signup form to your homepage to start collecting emails.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
