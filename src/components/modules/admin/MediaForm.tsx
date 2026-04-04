"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import {  X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IMedia } from "@/types/media.types";
import { createMediaAction, updateMediaAction } from "@/app/(commonLayout)/(dashboardRoutes)/admin/dashboard/media/_action";

// ── Zod Schema ───────────────────────────────────────
const mediaSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100),
    synopsis: z.string().max(500).optional(),
    type: z.enum(["MOVIE", "SERIES"], { message: "Type is required" }),
    pricingType: z.enum(["FREE", "PREMIUM"]).default("FREE"),
    price: z.number().nonnegative().optional(),
    platform: z
      .enum(["NETFLIX", "DISNEY_PLUS", "YOUTUBE", "AMAZON_PRIME", "HBO", "OTHER"])
      .default("OTHER"),
    videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    trailerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    director: z.string().max(100).optional(),
    releaseYear: z.number().int().min(1888).max(2030).optional(),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
  })
  .refine(
    (d) => !(d.pricingType === "PREMIUM" && !d.price),
    { message: "Price is required for PREMIUM content", path: ["price"] }
  );

type FormErrors = Partial<Record<keyof z.infer<typeof mediaSchema> | "thumbnail", string>>;

interface MediaFormProps {
  media?: IMedia;
  onSuccess?: () => void;
}

const PLATFORMS = ["NETFLIX", "DISNEY_PLUS", "YOUTUBE", "AMAZON_PRIME", "HBO", "OTHER"];
const GENRES = ["Action", "Drama", "Comedy", "Thriller", "Sci-Fi", "Horror", "Romance", "Adventure", "Animation", "Documentary", "Musical", "Mystery", "Sports", "Others"];

export default function MediaForm({ media, onSuccess }: MediaFormProps) {
  const router = useRouter();
  const isEdit = !!media;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: media?.title || "",
    synopsis: media?.synopsis || "",
    type: media?.type || "",
    pricingType: media?.pricingType || "FREE",
    price: media?.price?.toString() || "",
    platform: media?.platform || "OTHER",
    videoUrl: media?.videoUrl || "",
    trailerUrl: media?.trailerUrl || "",
    director: media?.director || "",
    releaseYear: media?.releaseYear?.toString() || "",
    isPublished: media?.isPublished || false,
    isFeatured: media?.isFeatured || false,
  });

  const [genre, setGenre] = useState<string[]>(media?.genre || []);
  const [castInput, setCastInput] = useState("");
  const [cast, setCast] = useState<string[]>(media?.cast || []);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(media?.thumbnailUrl || null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, thumbnail: "Max 5MB allowed" }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, thumbnail: "Only image files allowed" }));
      return;
    }
    setErrors((p) => ({ ...p, thumbnail: undefined }));
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const toggleGenre = (g: string) => {
    setGenre((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const addCast = () => {
    const trimmed = castInput.trim();
    if (trimmed && !cast.includes(trimmed)) {
      setCast((prev) => [...prev, trimmed]);
      setCastInput("");
    }
  };

  const removeCast = (name: string) => {
    setCast((prev) => prev.filter((c) => c !== name));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // validate
      const parsed = mediaSchema.safeParse({
        ...form,
        type: form.type || undefined,
        price: form.price ? Number(form.price) : undefined,
        releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
        videoUrl: form.videoUrl || undefined,
        trailerUrl: form.trailerUrl || undefined,
        director: form.director || undefined,
        synopsis: form.synopsis || undefined,
      });

      if (!parsed.success) {
        const fieldErrors: FormErrors = {};
        parsed.error.issues.forEach((i) => {
          const key = i.path[0] as keyof FormErrors;
          if (key) fieldErrors[key] = i.message;
        });
        setErrors(fieldErrors);
        throw new Error("Validation failed");
      }

      setErrors({});

      const formData = new FormData();
      formData.append("title", parsed.data.title);
      formData.append("type", parsed.data.type);
      formData.append("pricingType", parsed.data.pricingType);
      formData.append("platform", parsed.data.platform);
      formData.append("isPublished", String(parsed.data.isPublished));
      formData.append("isFeatured", String(parsed.data.isFeatured));
      formData.append("genre", JSON.stringify(genre));
      formData.append("cast", JSON.stringify(cast));

      if (parsed.data.synopsis) formData.append("synopsis", parsed.data.synopsis);
      if (parsed.data.price) formData.append("price", String(parsed.data.price));
      if (parsed.data.videoUrl) formData.append("videoUrl", parsed.data.videoUrl);
      if (parsed.data.trailerUrl) formData.append("trailerUrl", parsed.data.trailerUrl);
      if (parsed.data.director) formData.append("director", parsed.data.director);
      if (parsed.data.releaseYear) formData.append("releaseYear", String(parsed.data.releaseYear));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      if (isEdit) {
        return updateMediaAction(media.id, formData);
      } else {
        return createMediaAction(formData);
      }
    },
    onSuccess: (result) => {
      if (!result?.success) {
        toast.error(result?.message || "Failed");
        return;
      }
      toast.success(isEdit ? "Media updated!" : "Media created!");
      onSuccess?.();
      if (!isEdit) router.push("/admin/dashboard/media");
    },
    onError: (e: Error) => {
      if (e.message !== "Validation failed") toast.error("Something went wrong");
    },
  });

  const field = (
    key: string,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div className="space-y-1.5">
      <Label className={cn("text-sm font-medium", errors[key as keyof FormErrors] && "text-destructive")}>
        {label}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={form[key as keyof typeof form] as string}
        onChange={(e) => handleChange(key, e.target.value)}
        className={cn("h-10", errors[key as keyof FormErrors] && "border-destructive")}
      />
      {errors[key as keyof FormErrors] && (
        <p className="text-xs text-destructive">{errors[key as keyof FormErrors]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Basic Information
        </h3>

        {field("title", "Title *", "text", "e.g. Inception")}

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Synopsis</Label>
          <Textarea
            placeholder="Short description of the movie or series..."
            value={form.synopsis}
            onChange={(e) => handleChange("synopsis", e.target.value)}
            className="resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Type */}
          <div className="space-y-1.5">
            <Label className={cn("text-sm font-medium", errors.type && "text-destructive")}>
              Type *
            </Label>
            <Select value={form.type} onValueChange={(v) => handleChange("type", v)}>
              <SelectTrigger className={cn("h-10", errors.type && "border-destructive")}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOVIE">Movie</SelectItem>
                <SelectItem value="SERIES">Series</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
          </div>

          {/* Platform */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Platform</Label>
            <Select value={form.platform} onValueChange={(v) => handleChange("platform", v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field("director", "Director", "text", "e.g. Christopher Nolan")}
          {field("releaseYear", "Release Year", "number", "e.g. 2010")}
        </div>
      </section>

      {/* Genre */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Genre
        </h3>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggleGenre(g)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                genre.includes(g)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {g}
            </button>
          ))}
        </div>
        {genre.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected: {genre.join(", ")}
          </p>
        )}
      </section>

      {/* Cast */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Cast
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Add cast member..."
            value={castInput}
            onChange={(e) => setCastInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCast())}
            className="h-10"
          />
          <Button type="button" variant="outline" onClick={addCast} className="shrink-0">
            Add
          </Button>
        </div>
        {cast.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cast.map((name) => (
              <Badge key={name} variant="secondary" className="gap-1 pr-1">
                {name}
                <button
                  type="button"
                  onClick={() => removeCast(name)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </section>

      {/* Media URLs */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Media URLs
        </h3>
        {field("videoUrl", "Video URL", "url", "https://youtube.com/embed/...")}
        {field("trailerUrl", "Trailer URL", "url", "https://youtube.com/embed/...")}
      </section>

      {/* Thumbnail */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Thumbnail
        </h3>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors text-center",
            errors.thumbnail ? "border-destructive" : "border-border hover:border-primary/50"
          )}
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Click to change thumbnail
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload thumbnail
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP — max 5MB
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnail}
        />
        {errors.thumbnail && (
          <p className="text-xs text-destructive">{errors.thumbnail}</p>
        )}
      </section>

      {/* Pricing */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Pricing
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Pricing Type</Label>
            <Select
              value={form.pricingType}
              onValueChange={(v) => handleChange("pricingType", v)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">Free</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.pricingType === "PREMIUM" && (
            <div className="space-y-1.5">
              <Label className={cn("text-sm font-medium", errors.price && "text-destructive")}>
                Price (USD) *
              </Label>
              <Input
                type="number"
                placeholder="e.g. 9.99"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={cn("h-10", errors.price && "border-destructive")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Visibility */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Visibility
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium">Published</p>
              <p className="text-xs text-muted-foreground">
                Make this visible to users
              </p>
            </div>
            <Switch
              checked={form.isPublished}
              onCheckedChange={(v) => handleChange("isPublished", v)}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium">Featured</p>
              <p className="text-xs text-muted-foreground">
                Show on homepage Editor&apos;s Picks
              </p>
            </div>
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(v) => handleChange("isFeatured", v)}
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <Button
        onClick={() => mutate()}
        disabled={isPending}
        className="w-full h-11"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            {isEdit ? "Updating..." : "Creating..."}
          </>
        ) : isEdit ? (
          "Update Media"
        ) : (
          "Create Media"
        )}
      </Button>
    </div>
  );
}
