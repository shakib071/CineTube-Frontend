"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChangePasswordModal from "../auth/ChangePasswordModal";


export default function ProfileActions() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIsChangePasswordOpen(true)}
          className="gap-2"
        >
          <KeyRound className="w-4 h-4" />
          Change Password
        </Button>

        
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
