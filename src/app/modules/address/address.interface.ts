import { Types } from "mongoose";

export enum Label {
  home = "home",
  office = "office",
  other = "other",
}

export interface IAddress {
  user: Types.ObjectId;
  label?: Label;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  phone: string;
}
