import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { Role } from "../users/user.interface";
import { ParcelControllers } from "./parcel.controller";
import { createParcelZodSchema } from "./parcel.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SENDER),
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
router.get(
  "/incoming",
  checkAuth(Role.RECEIVER),
  ParcelControllers.incomingParcel
);
router.patch(
  "/confirm/:id",
  checkAuth(Role.RECEIVER),
  ParcelControllers.parcelConfirm
);
router.get(
  "/:id/status-log",
  checkAuth(Role.ADMIN, Role.SENDER, Role.RECEIVER),
  ParcelControllers.getParcelStatusLog
);
export const ParcelRoutes = router;
