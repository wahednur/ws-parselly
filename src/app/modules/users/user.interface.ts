export enum Role {
  ADMIN = "admin",
  SENDER = "sender",
  RECEIVER = "receiver",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: string;
  isVerify?: string;
  role: Role;
  auths: IAuthProvider[];
}
