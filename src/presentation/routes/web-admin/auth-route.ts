import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import { WebadminAuthController } from "@/presentation/controllers/web-admin/auth-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class WebadminAuthRoute {
  public route = "web-admin/auth";
  controller = container.get<WebadminAuthController>(WebadminAuthController);
  authMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `/${this.route}/me`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.me.bind(this.controller))
    );
    router.post(
      `/${this.route}/login`,
      asyncWrap(this.controller.login.bind(this.controller))
    );
  }
}
