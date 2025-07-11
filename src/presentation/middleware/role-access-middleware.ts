import { TYPES } from "@/types";
import { injectable, inject } from "inversify";
import { NextFunction, Response } from "express";
import asyncWrap from "@/libs/asyncWrapper";
import { AuthRequest } from "@/presentation/utils/types/jwt-request";
import { MenuRepository } from "@/domain/service/user-management/menu-repository";
import PermissionRepository from "@/domain/service/user-management/permission-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { RoleAccessRepository } from "@/domain/service/user-management/role-access-repository";
import { TMenuList, TPermissionList } from "@/const";

// example check on delete user routes
@injectable()
export class RoleAccessMiddleware {
  constructor(
    @inject(TYPES.MenuRepository)
    private _menuRepository: MenuRepository,
    @inject(TYPES.PermissionRepository)
    private _permissionRepository: PermissionRepository,
    @inject(TYPES.RoleAccessRepository)
    private _roleAccessRepository: RoleAccessRepository
  ) {}

  public checkRoleAccess(menuName: TMenuList, permissionName: TPermissionList) {
    return asyncWrap(
      async (req: AuthRequest, _: Response, next: NextFunction) => {
        const [menu, permission] = await Promise.all([
          this._menuRepository.findByField([
            { field: "name", value: menuName },
          ]),
          this._permissionRepository.findByField([
            { field: "name", value: permissionName },
          ]),
        ]);
        const user = req.auth.user.unmarshal();

        if (!menu || !permission || !user) {
          throw new AppError({
            statusCode: HttpCode.BAD_REQUEST,
            description: `Menu or permission or user token is invalid`,
          });
        }

        const roleAccess =
          await this._roleAccessRepository.getByRoleMenuPermission(
            user.roleId,
            menu.id,
            permission.id
          );

        if (!roleAccess || !roleAccess.status) {
          throw new AppError({
            statusCode: HttpCode.FORBIDDEN,
            description: `Forbidden access!`,
          });
        }

        next();
      }
    );
  }
}
