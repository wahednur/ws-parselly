import { Types } from "mongoose";

export enum ParcelStatus {
  REQUESTED = "Requested",
  APPROVED = "Approved",
  DISPATCHED = "Dispatched",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

export interface ITrackingEvent {
  status: ParcelStatus;
  timestamp: Date;
  updatedBy: Types.ObjectId;
  note?: string;
}

export interface IUserInfo {
  userId: Types.ObjectId;
  name: string;
  address: Types.ObjectId;
  phone: string;
}

export interface IParcel {
  trackingId: string;
  senderInfo: IUserInfo;
  receiverInfo: IUserInfo;
  type: string;
  weight: number;
  deliveryAddress: Types.ObjectId;
  status: ParcelStatus;
  trackingEvents: ITrackingEvent[];
  isBlocked: boolean;
  isCancelled: boolean;
}
