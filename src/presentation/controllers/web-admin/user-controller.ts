import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { UserService } from "@/services/web-admin/user-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
  userCreateScheme,
  userUpdateScheme,
} from "@/presentation/validation/user-validation";
import { FileSystem } from "@/infrastructure/file-system";
import { queryOptionValidation } from "@/presentation/validation/query-option-validation";
import { StandardResponse } from "@/libs/standard-response";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";

@injectable()
export default class UserController {
  constructor(@inject(TYPES.UserService) private _userService: UserService) {}

  public async getAll(req: Request, res: Response): Promise<Response> {
    const validatedPagination = queryOptionValidation.safeParse(req.query);
    if (!validatedPagination.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedPagination.error.flatten().fieldErrors,
      });
    }
    const [users, pagination] = await this._userService.findAll(
      validatedPagination.data
    );
    return StandardResponse.create(res)
      .setResponse({
        message: "Users fetched",
        data: users,
        status: HttpCode.OK,
      })
      .withPagination(pagination)
      .send();
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    const validatedReq = soleUuidValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const user = await this._userService.findById(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: "User detail fetched",
        data: user,
        status: HttpCode.OK,
      })
      .send();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const validatedReq = userCreateScheme.safeParse({
      ...req.body,
      avatarPath: req.file,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._userService.store({
      ...validatedReq.data,
      avatarPath: FileSystem.store(validatedReq.data.avatarPath, "user"),
    });
    return StandardResponse.create(res)
      .setResponse({
        message: "Success creating user",
        data: created,
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const validatedReq = userUpdateScheme.safeParse({
      ...req.params,
      ...req.body,
      avatarPath: req.file,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const updated = await this._userService.update(validatedReq.data.id, {
      ...validatedReq.data,
      avatarPath: validatedReq.data.avatarPath
        ? FileSystem.store(validatedReq.data.avatarPath, "user")
        : undefined,
    });
    return StandardResponse.create(res)
      .setResponse({
        message: "Success updating user",
        data: updated,
        status: HttpCode.OK,
      })
      .send();
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    const validatedReq = soleUuidValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    await this._userService.destroy(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: "User has been deleted",
        status: HttpCode.OK,
      })
      .send();
  }
}
