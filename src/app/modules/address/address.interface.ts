import { Types } from "mongoose";

export interface IAddress {
  user: Types.ObjectId;
  label?: "home" | "office" | "other";
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  phone: string;
}
