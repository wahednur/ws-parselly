import httpStatus from "http-status-codes";
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
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
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

export const ParcelServices = {
  createParcel,
  getParcels,
};
