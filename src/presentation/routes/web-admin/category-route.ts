import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import CategoryController from "@/presentation/controllers/web-admin/category-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class CategoryRoutes {
  public route = "/categories";

  controller = container.get<CategoryController>(CategoryController);
  authMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `${this.route}`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.getAll.bind(this.controller))
    );
    router.post(
      `${this.route}`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.create.bind(this.controller))
    );
    router.get(
      `${this.route}/:id`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.getById.bind(this.controller))
    );
    router.put(
      `${this.route}/:id`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.update.bind(this.controller))
    );
    router.delete(
      `${this.route}/:id`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.destroy.bind(this.controller))
    );
  }
}
