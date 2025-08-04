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

export const ParcelControllers = {
  createParcel,
  getParcels,
};
