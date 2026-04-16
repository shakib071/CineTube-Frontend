"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { IUser } from "@/types/user.types";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/(commonLayout)/profile/_action";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: IUser;
}

export function EditProfileModal({ isOpen, onClose, userData }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: userData.name,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState(userData.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setFormData({ name: userData.name, image: null });
    setImagePreview(userData.image || "");
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (formData.name === userData.name && !formData.image) {
      toast.error("No changes to save");
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      if (formData.name !== userData.name) submitData.append("name", formData.name);
      if (formData.image) submitData.append("image", formData.image);

      const result = await updateProfileAction(submitData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
      handleClose();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <Label htmlFor="image">
              Profile Image{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground transition-colors"
            >
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                {formData.image ? formData.image.name : "Click to upload image"}
              </span>
            </label>

            {imagePreview && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}