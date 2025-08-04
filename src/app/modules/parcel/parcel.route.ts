import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { Role } from "../users/user.interface";
import { ParcelControllers } from "./parcel.controller";
import { createParcelZodSchema } from "./parcel.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.SENDER),
  validateRequest(createParcelZodSchema),
  ParcelControllers.createParcel
);
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  ParcelControllers.getParcels
);
router.patch(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.cancelParcel
);
export const ParcelRoutes = router;
