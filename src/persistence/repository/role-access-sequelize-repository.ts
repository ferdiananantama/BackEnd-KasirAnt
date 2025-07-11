import { injectable } from "inversify";
import { RoleAccessRepository } from "@/domain/service/user-management/role-access-repository";
import {
  IRoleAccess,
  RoleAccess,
} from "@/domain/models/user-management/role-access";
import { RoleAccess as RoleAccessPersistence } from "@/infrastructure/database/models";
import { Op } from "sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export default class RoleAccessSequelizeRepository
  implements RoleAccessRepository
{
  async bulkCreate(props: IRoleAccess[]): Promise<RoleAccess[]> {
    const roleAccess = await RoleAccessPersistence.bulkCreate(props);
    return roleAccess.map((el) => RoleAccess.create(el.toJSON()));
  }

  async bulkDestroy(ids: string[]): Promise<boolean> {
    await RoleAccessPersistence.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return true;
  }

  async create(props: IRoleAccess): Promise<RoleAccess> {
    const roleAccess = await RoleAccessPersistence.create(props);
    return RoleAccess.create(roleAccess.toJSON());
  }

  async destroy(id: string): Promise<boolean> {
    const roleAccess = await RoleAccessPersistence.findByPk(id);
    if (!roleAccess) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role access not found",
      });
    }
    await roleAccess.destroy();
    return true;
  }

  async getByRole(roleId: string): Promise<RoleAccess[]> {
    const roleAccess = await RoleAccessPersistence.findAll({
      where: {
        roleId,
      },
    });
    return roleAccess.map((el) => RoleAccess.create(el.toJSON()));
  }

  async getByRoleMenu(roleId: string, menuId: string): Promise<RoleAccess[]> {
    const roleAccess = await RoleAccessPersistence.findAll({
      where: {
        roleId,
        menuId,
      },
    });
    return roleAccess.map((el) => RoleAccess.create(el.toJSON()));
  }

  async bulkUpsert(props: IRoleAccess[]): Promise<RoleAccess[]> {
    for (const item of props) {
      const [roleAccess, created] = await RoleAccessPersistence.findOrCreate({
        where: {
          roleId: item.roleId,
          menuId: item.menuId,
          permissionId: item.permissionId,
        },
        defaults: item,
      });

      if (!created) {
        roleAccess.status = item.status;
        await roleAccess.save();
      }
    }

    const roleAccesses = await RoleAccessPersistence.findAll({
      where: {
        roleId: props[0]?.roleId,
      },
    });
    return roleAccesses.map((el) => RoleAccess.create(el.toJSON()));
  }

  async getByRoleMenuPermission(
    roleId: string,
    menuId: string,
    permissionId: string
  ): Promise<RoleAccess | null> {
    const roleAccess = await RoleAccessPersistence.findOne({
      where: {
        roleId,
        menuId,
        permissionId,
      },
    });
    if (!roleAccess) return null;
    return RoleAccess.create(roleAccess.toJSON());
  }
}
