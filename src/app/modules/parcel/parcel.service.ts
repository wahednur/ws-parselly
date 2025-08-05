import StatusCodes from "http-status-codes";
import mongoose, { Types } from "mongoose";
import { generateTrackingId } from "../../../utils/generateTrackingId";
import AppError from "../../errorHelpers/errorHelpers";
import { Address } from "../address/address.model";
import { User } from "../users/user.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcel = async (payload: Partial<IParcel>, userId: string) => {
  const trackingId = await generateTrackingId();

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found");
  }

  // Save sender Address
  console.log(payload);
  const senderAddress = await Address.create({
    ...payload.senderInfo,
    user: user._id,
  });
  // console.log("Sender info", senderAddress);
  // Save Receiver address
  const receiverAddress = await Address.create({
    ...payload.receiverInfo,
    user: payload.receiverInfo?.userId,
  });
  console.log("Receiver info", senderAddress);
  //Save Delivery address
  const deliveryAddress = await Address.create({
    ...payload.receiverInfo,
    user: payload.receiverInfo?.userId,
  });
  console.log("Delivery info", deliveryAddress);
  const initialTrackingEvent = {
    status: ParcelStatus.REQUESTED,
    timestamp: new Date(),
    updatedBy: user._id,
    note: "Parcel created",
  };

  // Delivery address
  const finalDeliveryAddress = receiverAddress || deliveryAddress;

  const parcelPayload = {
    trackingId: trackingId,
    status: ParcelStatus.REQUESTED,
    isBlocked: false,
    isCancelled: false,
    deliveryAddress: finalDeliveryAddress._id,
    receiverInfo: {
      ...payload.senderInfo,
      userId: user._id,
      address: senderAddress._id,
    },
    senderInfo: {
      ...payload.senderInfo,
      userId: user._id,
      address: senderAddress._id,
    },
    type: payload.type,
    weight: payload.weight,
  };
  return await Parcel.create(parcelPayload);
};

const getParcels = async (userId: string) => {
  return await Parcel.find({
    $or: [{ "senderInfo.userId": userId }, { "receiverInfo.userId": userId }],
  })
    .populate("senderInfo.address")
    .populate("receiverInfo.address")
    .populate("deliveryAddress");
};

const cancelParcel = async (parcelId: string, userId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }

  //Only allow if user is sender
  if (parcel.senderInfo.userId.toString() !== userId.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to cancel this parcel"
    );
  }

  //Only allow if not dispatched yet
  if (["In Transit", "Delivered"].includes(parcel.status)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Parcel cannot be cancelled after dispatch"
    );
  }
  // Update status and push tracking log

  if (parcel.status === ParcelStatus.CANCELLED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Parcel already canceled");
  }
  parcel.status = ParcelStatus.CANCELLED;
  parcel.trackingEvents.push({
    status: ParcelStatus.CANCELLED,
    note: "Parcel cancelled by sender",
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(userId),
  });

  await parcel.save();
  return parcel;
};
const incomingParcel = async (userId: string) => {
  const parcels = await Parcel.find({
    "receiverInfo.userId": new Types.ObjectId(userId),
    status: { $nin: ["Delivered", "Cancelled"] },
  });
  return parcels;
};

const confirmDelivery = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid parcel ID");
  }
  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Parcel not found");
  }
  if (parcel.receiverInfo.userId.toString() !== userId.toString()) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Unauthorized to confirm delivery"
    );
  }

  parcel.status = ParcelStatus.DELIVERED;
  parcel.trackingEvents.push({
    status: ParcelStatus.DELIVERED,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(userId),
    note: "Parcel confirmed by receiver",
  });
  await parcel.save();
  return parcel;
};
const getParcelStatusLog = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid parcel ID");
  }

  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }

  const senderId = parcel.senderInfo.userId?.toString();
  const receiverId = parcel.receiverInfo.userId?.toString();

  if (userId !== senderId && userId !== receiverId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Unauthorized to view status log"
    );
  }
  return parcel.trackingEvents;
};
export const ParcelServices = {
  createParcel,
  getParcels,
  cancelParcel,
  incomingParcel,
  confirmDelivery,
  getParcelStatusLog,
};
