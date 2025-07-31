import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProvideSchema = new Schema<IAuthProvider>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: String, enum: IsActive.ACTIVE, default: IsActive.ACTIVE },
    isVerify: { type: Boolean, default: false },
    auths: [authProvideSchema],
    address: { type: Schema.Types.ObjectId, ref: "Address" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
