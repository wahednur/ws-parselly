import { Types } from "mongoose";

export enum Role {
  ADMIN = "admin",
  SENDER = "sender",
  RECEIVER = "receiver",
  USER = "user",
}

export enum IsActive {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  photo?: string;
  address?: Types.ObjectId;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
}
