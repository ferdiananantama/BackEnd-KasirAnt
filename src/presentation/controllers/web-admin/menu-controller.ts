import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { MenuService } from "@/services/web-admin/menu-service";
import { Request, Response } from "express";
import { queryOptionValidation } from "@/presentation/validation/query-option-validation";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import {
  changeRuleValidation,
  menuCreateValidation,
  menuUpdateValidation,
} from "@/presentation/validation/web-admin/menu-validation";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";
import {
  updateRoleAccessesValidation,
  roleIdValidation,
} from "@/presentation/validation/web-admin/role-validation";

@injectable()
export default class MenuController {
  constructor(@inject(TYPES.MenuService) private _service: MenuService) {}

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
        message: "Menu fetched",
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
    const menu = await this._service.findById(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: "Menu fetched",
        data: menu,
        status: HttpCode.OK,
      })
      .send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const validatedReq = menuUpdateValidation.safeParse({
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
        message: "Menu updated",
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
        message: "Menu deleted",
        status: HttpCode.OK,
      })
      .send();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const validatedReq = menuCreateValidation.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const menu = await this._service.create(validatedReq.data);
    return StandardResponse.create(res)
      .setResponse({
        message: "Menu created",
        data: menu,
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }

  public async seed(_: Request, res: Response): Promise<Response> {
    await this._service.seed();
    return StandardResponse.create(res)
      .setResponse({
        message: "Seed menu, permission, and menu permission rule is success",
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }

  public async getRule(_: Request, res: Response): Promise<Response> {
    const data = await this._service.getMenuRule();
    return StandardResponse.create(res)
      .setResponse({
        message: "Menu rule fetched",
        data,
        status: HttpCode.OK,
      })
      .send();
  }

  public async changeRuleStatus(
    req: Request,
    res: Response
  ): Promise<Response> {
    const validated = changeRuleValidation.safeParse({ ...req.body });
    if (!validated.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validated.error.flatten().fieldErrors,
      });
    }
    await this._service.changeMenuPermissionStatus(
      {
        menuId: validated.data.menuId,
        permissionId: validated.data.permissionId,
      },
      validated.data.status
    );
    return StandardResponse.create(res)
      .setResponse({
        message: "Menu permission rule changed",
        status: HttpCode.OK,
      })
      .send();
  }

  public async getRoleAccessesByRoleId(
    req: Request,
    res: Response
  ): Promise<Response> {
    const validatedReq = roleIdValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const [menus, roleAccesses, role] =
      await this._service.getRoleAccessesByRoleId(validatedReq.data.roleId);
    return StandardResponse.create(res)
      .setResponse({
        message: "Mapping menu fetched",
        data: {
          role: role,
          menus: menus,
          roleAccesses: roleAccesses,
        },
        status: HttpCode.OK,
      })
      .send();
  }

  public async updateRoleAccessesByRoleId(
    req: Request,
    res: Response
  ): Promise<Response> {
    const validatedRoleId = roleIdValidation.safeParse(req.params);
    if (!validatedRoleId.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedRoleId.error.flatten().fieldErrors,
      });
    }
    const validated = updateRoleAccessesValidation.safeParse(req.body);
    if (!validated.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validated.error.errors,
      });
    }

    if (validated.data.length === 0)
      return res.status(HttpCode.NO_CONTENT).send();

    await this._service.updateRoleAccessesByRoleId(
      validated.data,
      validatedRoleId.data.roleId
    );
    return StandardResponse.create(res)
      .setResponse({
        message: "Role accesses updated",
        status: HttpCode.OK,
      })
      .send();
  }
}
