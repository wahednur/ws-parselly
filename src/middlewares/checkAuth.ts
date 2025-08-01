import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../app/configs/env";
import AppError from "../app/errorHelpers/errorHelpers";
import { IsActive } from "../app/modules/users/user.interface";
import { User } from "../app/modules/users/user.model";
import { verifyToken } from "../utils/jwt/jwt";

export const checkAuth = (...authRoles: []) => {
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(StatusCodes.FORBIDDEN, "No authorization token");
      }
      const token = authHeader.split(" ")[1];
      const verifiedToken = verifyToken(
        token,
        envVars.JWT_SECRET
      ) as JwtPayload;
      const existUser = await User.findOne({ email: verifiedToken.email });
      if (!existUser) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
      }
      if (!existUser.isVerify) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not verified");
      }
      if (
        existUser.isActive === IsActive.BLOCKED ||
        existUser.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `User is ${existUser.isActive}`
        );
      }
      if (existUser.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
      }
      if (!authHeader.includes(verifiedToken.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You are not permitted to view this route"
        );
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
};
