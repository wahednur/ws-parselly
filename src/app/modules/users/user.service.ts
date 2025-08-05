import { hashSync } from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../configs/env";
import AppError from "../../errorHelpers/errorHelpers";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exits");
  }
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };
  const hashedPass = await hashSync(
    password as string,
    Number(envVars.BCRYPT_SALT)
  );
  const user = await User.create({
    email,
    password: hashedPass,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

export const UserServices = {
  createUser,
};
