import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { PermissionService } from "@/services/web-admin/permission-service";
import { Request, Response } from "express";
import { queryOptionValidation } from "@/presentation/validation/query-option-validation";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";
import {
  permissionCreateValidation,
  permissionUpdateValidation,
} from "@/presentation/validation/web-admin/permission-validation";
import { TPermissionList } from "@/const";

@injectable()
export default class PermissionController {
  constructor(
    @inject(TYPES.PermissionService) private _service: PermissionService
  ) {}

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
        message: "Permission fetched",
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
        message: "Permission fetched",
        data: permission,
        status: HttpCode.OK,
      })
      .send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const validatedReq = permissionUpdateValidation.safeParse({
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
    const menu = await this._service.update(id, {
      name: <TPermissionList>data.name,
    });
    return StandardResponse.create(res)
      .setResponse({
        message: "Permission updated",
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
        message: "Permission deleted",
        status: HttpCode.OK,
      })
      .send();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const validatedReq = permissionCreateValidation.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const menu = await this._service.create({
      name: <TPermissionList>validatedReq.data.name,
    });
    return StandardResponse.create(res)
      .setResponse({
        message: "Permission created",
        data: menu,
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }
}
