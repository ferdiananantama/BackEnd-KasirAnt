import { injectable } from "inversify";
import { container } from "@/container";
import RoleController from "@/presentation/controllers/web-admin/role-controller";
import { Router } from "express";
import asyncWrap from "@/libs/asyncWrapper";

@injectable()
export class RoleRoutes {
  public route = "/roles";
  controller = container.get<RoleController>(RoleController);

  public setRoutes(router: Router) {
    router.get(
      this.route,
      asyncWrap(this.controller.getAll.bind(this.controller))
    );
    router.post(
      this.route,
      asyncWrap(this.controller.create.bind(this.controller))
    );
    // router.get(
    //   `${this.route}/seed-admin`,
    //   asyncWrap(this.controller.seedAdmin.bind(this.controller))
    // );
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
