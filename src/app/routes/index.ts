import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
