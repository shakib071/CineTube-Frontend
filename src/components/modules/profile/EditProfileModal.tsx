"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/types/user.types";
import { toast } from "sonner";
import { X, Upload, Loader2 } from "lucide-react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.name.trim()) {
  //     toast.error("Name is required");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const submitData = new FormData();
  //     submitData.append("name", formData.name);
  //     if (formData.image) {
  //       submitData.append("image", formData.image);
  //     }

  //     // TODO: Add your API call here to update the user profile
  //     // Example:
  //     // const response = await httpClient.put(`/users/${userData.id}`, submitData, {
  //     //   headers: {
  //     //     "Content-Type": "multipart/form-data",
  //     //   },
  //     // });

  //     console.log("Updating profile with:", {
  //       name: formData.name,
  //       hasImage: !!formData.image,
  //       fileName: formData.image?.name,
  //     });

  //     toast.success("Profile updated successfully!");
  //     onClose();
  //   } catch (error) {
  //     toast.error("Failed to update profile");
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    toast.error("Name is required");
    return;
  }

  // check at least something changed
  if (formData.name === userData.name && !formData.image) {
    toast.error("No changes to save");
    return;
  }

  setIsLoading(true);
  try {
    const submitData = new FormData();

    // only append name if it changed
    if (formData.name !== userData.name) {
      submitData.append("name", formData.name);
    }

    // only append image if selected
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    const result = await updateProfileAction(submitData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Profile updated successfully!");
    router.refresh(); // re-fetch the profile page
    onClose();
  } catch (error) {
    toast.error("Failed to update profile");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md bg-card border-border text-foreground max-h-[50vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Image Field */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-foreground">
                Profile Image{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <div className="relative">
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
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
