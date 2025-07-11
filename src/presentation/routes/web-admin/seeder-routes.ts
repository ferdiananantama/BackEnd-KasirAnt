import { injectable } from "inversify";
import { container } from "@/container";
import { Router } from "express";
import asyncWrap from "@/libs/asyncWrapper";
import { SeederController } from "@/presentation/controllers/web-admin/seeder-controller";

@injectable()
export class SeederRoutes {
  public route = "/seeders";
  controller = container.get<SeederController>(SeederController);

  public setRoutes(router: Router) {
    router.get(
      `${this.route}/user-managements`,
      asyncWrap(this.controller.seedUserManagement.bind(this.controller))
    );
  }
}
