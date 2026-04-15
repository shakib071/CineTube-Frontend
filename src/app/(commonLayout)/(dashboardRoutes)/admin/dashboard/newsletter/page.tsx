"use client";

import { useState, useEffect, useTransition } from "react";
import { Mail, Search, X, ChevronLeft, ChevronRight, ArrowUpAZ, ArrowDownAZ, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNewsletterSubscribersAction } from "../_action";

interface INewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function AdminNewsletterPage() {
  const [isPending, startTransition] = useTransition();

  const [subscribers, setSubscribers] = useState<INewsletterSubscriber[]>([]);
  const [meta, setMeta] = useState<IMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // console.log({subscribers})

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on sort change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [sortOrder]);

  // Fetch data
  useEffect(() => {
    startTransition(async () => {
      const params: Record<string, string> = {
        page: String(page),
        limit: "10",
        sortBy: "createdAt",
        sortOrder,
      };
      if (debouncedSearch) params.searchTerm = debouncedSearch;
      // console.log({params})
      const res = await getNewsletterSubscribersAction(params);
      if (res.success && res.data) {
        setSubscribers(res.data.subscribers);
        setMeta(res.data.meta);
      }
    });
  }, [page, debouncedSearch, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Newsletter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All email addresses subscribed to the CineTube newsletter.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort order */}
        <Select
          value={sortOrder}
          onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
        >
          <SelectTrigger className="w-44 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">
              <span className="flex items-center gap-2">
                <ArrowDownAZ className="w-4 h-4" />
                Newest first
              </span>
            </SelectItem>
            <SelectItem value="asc">
              <span className="flex items-center gap-2">
                <ArrowUpAZ className="w-4 h-4" />
                Oldest first
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table card */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-500" />
            Subscribers
            <Badge variant="secondary" className="text-xs ml-1">
              {isPending ? "..." : meta.total}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {debouncedSearch ? `No results for "${debouncedSearch}"` : "No subscribers yet"}
              </p>
              {debouncedSearch && (
                <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {/* Header row */}
              <div className="flex items-center justify-between pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Email</span>
                <span>Subscribed on</span>
              </div>

              {/* Rows */}
              {subscribers.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-3 gap-4 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 text-xs font-semibold text-red-500">
                      {(page - 1) * 10 + i + 1}
                    </div>
                    <span className="text-sm text-foreground truncate">
                      {s.email}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {fmtDate(s.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && !isPending && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)} of{" "}
            {meta.total} subscribers
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-foreground">
              {page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
