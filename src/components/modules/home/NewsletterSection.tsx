import { Sparkles } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function NewsletterSection() {
  return (
    <section className="rounded-2xl border border-border/50 bg-card px-6 py-10 text-center space-y-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10">
        <Sparkles className="w-5 h-5 text-red-500" />
      </div>

      <h2 className="text-2xl font-bold text-foreground">Stay in the loop</h2>

      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        Get notified about new titles, exclusive deals, and editor picks delivered to your inbox.
      </p>

      <NewsletterForm />

      <p className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
    </section>
  );
}
