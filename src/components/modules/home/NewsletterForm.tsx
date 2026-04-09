"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletterAction } from "@/app/(commonLayout)/_action";


export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const res = await subscribeNewsletterAction(email.trim());
    setLoading(false);
    if (res.success) {
      setDone(true);
      setEmail("");
    } else {
      setError(res.message);
    }
  };

  if (done) {
    return (
      <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm py-2">
        <CheckCircle2 className="w-4 h-4" />
        You&apos;re subscribed! Welcome to CineTube.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-10 text-sm flex-1"
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={loading || !email.trim()}
        className="h-10 gap-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 font-semibold"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Subscribe
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-destructive mt-1 text-center w-full">{error}</p>
      )}
    </form>
  );
}
