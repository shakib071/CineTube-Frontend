export interface IAdmin {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  userId: string;
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;

  createdAt: Date;
  updatedAt: Date;

  role: Role;
  status: UserStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;

  admin?: IAdmin | null;
}