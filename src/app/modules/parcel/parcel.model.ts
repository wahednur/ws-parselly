import { model, Schema } from "mongoose";
import { IParcel, ITrackingEvent, ParcelStatus } from "./parcel.interface";

const userInfoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const trackingEventSchema = new Schema<ITrackingEvent>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true,
    },
    timestamp: { type: Date, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
  },
  { _id: false }
);

const parcelSchema = new Schema<IParcel>(
  {
    trackingId: { type: String, unique: true, required: true },
    senderInfo: { type: userInfoSchema, required: true },
    receiverInfo: { type: userInfoSchema, required: true },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    trackingEvents: [trackingEventSchema],
    isBlocked: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.REQUESTED,
    },
  },
  { timestamps: true }
);

export const Parcel = model<IParcel>("Parcel", parcelSchema);
