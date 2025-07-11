import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import { Router } from "express";
import { injectable } from "inversify";
import multer from "multer";
import UserController from "@/presentation/controllers/web-admin/user-controller";
import { RoleAccessMiddleware } from "@/presentation/middleware/role-access-middleware";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";

const tmpUploadedFiles = multer({
  dest: "tmp_uploaded_files/user",
});

@injectable()
export class UserRoutes {
  public route = "/users";
  controller = container.get<UserController>(UserController);
  authMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
  roleAccessMiddleware =
    container.get<RoleAccessMiddleware>(RoleAccessMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `${this.route}`,
      asyncWrap(this.controller.getAll.bind(this.controller))
    );
    router.post(
      `${this.route}`,
      tmpUploadedFiles.single("avatarPath"),
      asyncWrap(this.controller.create.bind(this.controller))
    );
    router.get(
      `${this.route}/:id`,
      asyncWrap(this.controller.getById.bind(this.controller))
    );
    router.put(
      `${this.route}/:id`,
      tmpUploadedFiles.single("avatarPath"),
      asyncWrap(this.controller.update.bind(this.controller))
    );
    router.delete(
      `${this.route}/:id`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      this.roleAccessMiddleware.checkRoleAccess("ACCOUNT", "DELETE"),
      asyncWrap(this.controller.destroy.bind(this.controller))
    );
  }
}
