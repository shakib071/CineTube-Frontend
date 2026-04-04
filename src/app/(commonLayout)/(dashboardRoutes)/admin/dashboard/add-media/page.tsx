import MediaForm from "@/components/modules/admin/MediaForm";

export const metadata = {
  title: "Add Media | CineTube Admin",
  description: "Create a new movie or series entry for the CineTube platform.",
};

export default function AddMediaPage() {
  return (
    <div className="space-y-8 py-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Admin panel
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Add new media
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Create a new movie or series entry with title, synopsis, thumbnail,
            pricing, release details and visibility settings.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors duration-200">
        <MediaForm />
      </section>
    </div>
  );
}
