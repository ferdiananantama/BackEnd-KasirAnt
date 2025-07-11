import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { HttpCode } from "@/libs/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { SeederService } from "@/services/web-admin/seeder-service";

@injectable()
export class SeederController {
  constructor(@inject(TYPES.SeederService) private _service: SeederService) {}

  public async seedUserManagement(
    _: Request,
    res: Response
  ): Promise<Response> {
    await this._service.seedUserManagement();
    return StandardResponse.create(res)
      .setResponse({
        message: "Seed user management is success",
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }
}
