import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ParcelServices } from "./parcel.service";

import StatusCodes from "http-status-codes";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const parcel = await ParcelServices.createParcel(
    req.body,
    decodedToken.userId
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Parcel Created successfully",
    data: parcel,
  });
});

const getParcels = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const parcel = await ParcelServices.getParcels(user.userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All parcel retrieved",
    data: parcel,
  });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await ParcelServices.cancelParcel(id, user.userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parcel cancelled successfully",
    data: result,
  });
});

const incomingParcel = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await ParcelServices.incomingParcel(user.userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parcel retrieved successfully",
    data: result,
  });
});

const parcelConfirm = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await ParcelServices.confirmDelivery(id, user.userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parcel confirmed successfully",
    data: result,
  });
});

const getParcelStatusLog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await ParcelServices.getParcelStatusLog(id, user.userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parcel status log fetched successfully",
    data: result,
  });
});
export const ParcelControllers = {
  createParcel,
  getParcels,
  cancelParcel,
  incomingParcel,
  parcelConfirm,
  getParcelStatusLog,
};
