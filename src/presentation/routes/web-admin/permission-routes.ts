import { injectable } from "inversify";
import { container } from "@/container";
import { Router } from "express";
import asyncWrap from "@/libs/asyncWrapper";
import PermissionController from "@/presentation/controllers/web-admin/permission-controller";

@injectable()
export class PermissionRoutes {
  public route = "/permissions";
  controller = container.get<PermissionController>(PermissionController);

  public setRoutes(router: Router) {
    router.get(
      this.route,
      asyncWrap(this.controller.getAll.bind(this.controller))
    );
    router.post(
      this.route,
      asyncWrap(this.controller.create.bind(this.controller))
    );
    router.get(
      `${this.route}/:id`,
      asyncWrap(this.controller.getById.bind(this.controller))
    );
    router.put(
      `${this.route}/:id`,
      asyncWrap(this.controller.update.bind(this.controller))
    );
    router.delete(
      `${this.route}/:id`,
      asyncWrap(this.controller.destroy.bind(this.controller))
    );
  }
}
