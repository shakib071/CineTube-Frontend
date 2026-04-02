"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { IUser } from "@/types/user.types";
import { EditProfileModal } from "./EditProfileModal";

interface EditProfileButtonProps {
  userData: IUser;
}

export function EditProfileButton({ userData }: EditProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleEditProfile}
        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
      />
    </>
  );
}
