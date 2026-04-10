/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { changePasswordAction } from "@/app/(commonLayout)/(authRoutes)/auth/_action";
import { logoutAction } from "@/app/(commonLayout)/(authRoutes)/logout/_action";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);
    const res = await changePasswordAction(currentPassword, newPassword);
    setLoading(false);

    if (!res.success) {
      setError((res as any).message);
      return;
    }

    toast.success("Password changed! Please login again.");
    handleClose();

    // Clear cookies and redirect to login
    await logoutAction();
    router.push("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-red-500" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            You will be logged out after changing your password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Current password */}
          <div className="space-y-1.5">
            <Label>Current password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="pr-10"
              />
              <Button
                type="button" variant="ghost" size="icon"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute inset-y-0 right-0 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <Label>New password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="pr-10"
              />
              <Button
                type="button" variant="ghost" size="icon"
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-0 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label>Confirm new password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className={confirmPassword && confirmPassword !== newPassword ? "border-destructive" : ""}
              />
              {confirmPassword && confirmPassword === newPassword && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
          </div>

          {error && (
            <Alert className="bg-destructive/10 border-destructive/30 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button" variant="outline" className="flex-1"
              onClick={handleClose} disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
