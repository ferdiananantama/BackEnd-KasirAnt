import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { RoleService } from "@/services/web-admin/role-service";
import { Request, Response } from "express";
import { queryOptionValidation } from "@/presentation/validation/query-option-validation";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";
import {
  roleCreateValidation,
  roleUpdateValidation,
} from "@/presentation/validation/web-admin/role-validation";

@injectable()
export default class RoleController {
  constructor(@inject(TYPES.RoleService) private _service: RoleService) {}
  public async getAll(req: Request, res: Response): Promise<Response> {
    const validatedReq = queryOptionValidation.safeParse(req.query);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const [rows, pagination] = await this._service.findAll(validatedReq.data);
    return StandardResponse.create(res)
      .setResponse({
        message: "Roles fetched",
        data: rows,
        status: HttpCode.OK,
      })
      .withPagination(pagination?.omitProperties("offset"))
      .send();
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    const validatedReq = soleUuidValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const permission = await this._service.findById(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: "Role fetched",
        data: permission,
        status: HttpCode.OK,
      })
      .send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const validatedReq = roleUpdateValidation.safeParse({
      ...req.params,
      ...req.body,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const { id, ...data } = validatedReq.data;
    const menu = await this._service.update(id, data);
    return StandardResponse.create(res)
      .setResponse({
        message: "Role updated",
        data: menu,
        status: HttpCode.OK,
      })
      .send();
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    const validatedReq = soleUuidValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    await this._service.destroy(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: "Role deleted",
        status: HttpCode.OK,
      })
      .send();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const validatedReq = roleCreateValidation.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const menu = await this._service.create({
      name: validatedReq.data.name,
    });
    return StandardResponse.create(res)
      .setResponse({
        message: "Role created",
        data: menu,
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }

  public async seedAdmin(_: Request, res: Response): Promise<Response> {
    await this._service.seedAdmin();
    return StandardResponse.create(res)
      .setResponse({
        message:
          "Seed super admin role, super admin role access, and super admin user is success",
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }
}
