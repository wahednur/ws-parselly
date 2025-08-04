import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import passport from "passport";
import catchAsync from "../../../utils/catchAsync";
import { setAuthCookie } from "../../../utils/jwt/setCookies";
import { createUserToken } from "../../../utils/jwt/userToken";
import sendResponse from "../../../utils/sendResponse";
import { envVars } from "../../configs/env";
import AppError from "../../errorHelpers/errorHelpers";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        const errorMessage = typeof err === "string" ? err : err.message;
        return next(new AppError(httpStatus.UNAUTHORIZED, errorMessage));
      }
      if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, info.message));
      }

      const userTokens = await createUserToken(user);
      const { password: pass, ...rest } = user.toObject();
      setAuthCookie(res, user);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const tokenInfo = createUserToken(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);
export const AuthControllers = {
  credentialsLogin,
  googleCallbackController,
};
