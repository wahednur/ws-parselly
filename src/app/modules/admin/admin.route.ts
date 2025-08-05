import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/parcels", checkAuth(Role.ADMIN), AdminController.getAllParcel);
router.patch(
  "/parcels/status/:id",
  checkAuth(Role.ADMIN),
  AdminController.updateParcelStatusByAdmin
);

router.patch(
  "/users/block/:id",
  checkAuth(Role.ADMIN),
  AdminController.updateUserStatus
);

export const AdminRoutes = router;
