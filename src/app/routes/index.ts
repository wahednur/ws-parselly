import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { UserRoutes } from "../modules/users/user.routes";

export const router = Router();

interface IRoute {
  path: string;
  route: Router;
}
const moduleRoutes: IRoute[] = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/parcels",
    route: ParcelRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
