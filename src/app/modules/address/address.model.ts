import { model, Schema } from "mongoose";
import { IAddress, Label } from "./address.interface";

const addressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, enum: Object.values(Label), default: Label.home },
    state: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Bangladesh" },
    phone: { type: String, required: true },
  },

  { timestamps: true }
);

export const Address = model<IAddress>("Address", addressSchema);
