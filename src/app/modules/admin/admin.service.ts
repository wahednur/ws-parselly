import { StatusCodes } from "http-status-codes";
import mongoose, { Types } from "mongoose";
import AppError from "../../errorHelpers/errorHelpers";
import { ParcelStatus } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { IsActive } from "../users/user.interface";
import { User } from "../users/user.model";

const getAllParcel = async () => {
  return await Parcel.find();
};

const updateParcelStatusByAdmin = async (
  id: string,
  status: ParcelStatus,
  note: string,
  updatedBy: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid parcel ID");
  }

  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Parcel not found");
  }

  if (
    ![
      ParcelStatus.APPROVED,
      ParcelStatus.DISPATCHED,
      ParcelStatus.IN_TRANSIT,
    ].includes(status)
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid status for admin update"
    );
  }

  parcel.status = status;
  parcel.trackingEvents.push({
    status: status,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(updatedBy),
    note: note || `Status updated to ${status}`,
  });
  await parcel.save();
  return parcel;
};
const updateUserStatus = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid user ID");
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  }
  user.isActive =
    user.isActive === IsActive.BLOCKED ? IsActive.ACTIVE : IsActive.BLOCKED;

  await user.save();

  return user;
};

export const AdminServices = {
  getAllParcel,
  updateParcelStatusByAdmin,
  updateUserStatus,
};
