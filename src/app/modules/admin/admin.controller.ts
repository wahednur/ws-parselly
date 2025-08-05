import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAllParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllParcel();
  sendResponse(res, {
    success: true,
    message: "All parcel retrieved",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateParcelStatusByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, note } = req.body;
    const user = req.user as JwtPayload;

    const result = await AdminServices.updateParcelStatusByAdmin(
      id,
      status,
      note,
      user.userId
    );

    sendResponse(res, {
      success: true,
      message: "Parcel Updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  }
);

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminServices.updateUserStatus(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `User status updated to ${result.isActive}`,
    data: result,
  });
});

export const AdminController = {
  getAllParcel,
  updateParcelStatusByAdmin,
  updateUserStatus,
};
