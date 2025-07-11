import { injectable } from "inversify";
import MenuController from "@/presentation/controllers/web-admin/menu-controller";
import { container } from "@/container";
import { Router } from "express";
import asyncWrap from "@/libs/asyncWrapper";

@injectable()
export class MenuRoutes {
  public route = "/menus";
  controller = container.get<MenuController>(MenuController);

  public setRoutes(router: Router) {
    router.get(
      this.route,
      asyncWrap(this.controller.getAll.bind(this.controller))
    );
    // router.post(
    //   this.route,
    //   asyncWrap(this.controller.create.bind(this.controller))
    // );
    // router.get(
    //   `${this.route}/seed`,
    //   asyncWrap(this.controller.seed.bind(this.controller))
    // );
    // router.get(
    //   `${this.route}/rules`,
    //   asyncWrap(this.controller.getRule.bind(this.controller))
    // );
    // router.put(
    //   `${this.route}/rules`,
    //   asyncWrap(this.controller.changeRuleStatus.bind(this.controller))
    // );
    router.get(
      `${this.route}/role-accesses/:roleId`,
      asyncWrap(this.controller.getRoleAccessesByRoleId.bind(this.controller))
    );
    router.put(
      `${this.route}/role-accesses/:roleId`,
      asyncWrap(
        this.controller.updateRoleAccessesByRoleId.bind(this.controller)
      )
    );
    router.get(
      `${this.route}/:id`,
      asyncWrap(this.controller.getById.bind(this.controller))
    );
    // router.put(
    //   `${this.route}/:id`,
    //   asyncWrap(this.controller.update.bind(this.controller))
    // );
    // router.delete(
    //   `${this.route}/:id`,
    //   asyncWrap(this.controller.destroy.bind(this.controller))
    // );
  }
}
