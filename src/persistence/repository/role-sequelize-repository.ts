import { injectable } from "inversify";
import { RoleRepository } from "@/domain/service/user-management/role-repository";
import { IRole, Role } from "@/domain/models/user-management/role";
import {
  Role as RolePersistence,
  MenuPermissionRule as MenuPermissionRulePersistence,
  RoleAccess as RoleAccessPersistence,
} from "@/infrastructure/database/models";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { Op, Order } from "sequelize";
import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import { Pagination } from "@/domain/models/pagination";
import { SUPER_ADMIN_ROLE } from "@/const";
import { IRoleAccess } from "@/domain/models/user-management/role-access";
import { validateOrderByColumn } from "@/libs/formatters";
import { VALID_ORDERBY_COLUMN } from "@/const";

@injectable()
export class RoleSequelizeRepository implements RoleRepository {
  async create(props: IRole): Promise<Role> {
    const role = await RolePersistence.create(props);
    const menuPermissionRules = await MenuPermissionRulePersistence.findAll({
      where: {
        isEnable: true,
      },
    });
    const bulkRoleAccess: IRoleAccess[] = menuPermissionRules.map((el) => ({
      menuId: el.menuId,
      permissionId: el.permissionId,
      roleId: role.id,
      status: false,
    }));
    await RoleAccessPersistence.bulkCreate(bulkRoleAccess);
    return Role.create(role.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    const role = await RolePersistence.findByPk(id);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role not found",
      });
    }
    await role.destroy();
    return true;
  }

  async seedAdmin(option: Partial<BaseQueryOption>): Promise<void> {
    // insert super admin role
    const [role] = await RolePersistence.findOrCreate({
      where: {
        name: SUPER_ADMIN_ROLE,
      },
      defaults: {
        name: SUPER_ADMIN_ROLE,
      },
      transaction: option.t,
    });

    const menuPermissionRules = await MenuPermissionRulePersistence.findAll({
      where: {
        isEnable: true,
      },
      transaction: option.t,
    });
    const bulkRoleAccess: IRoleAccess[] = menuPermissionRules.map((el) => ({
      menuId: el.menuId,
      permissionId: el.permissionId,
      roleId: role.id,
      status: true,
    }));

    // remove discarded / unused role access
    const discardedRoleAccesses = await RoleAccessPersistence.findAll({
      where: {
        roleId: role.id,
        [Op.not]: {
          [Op.and]: bulkRoleAccess.map((el) => ({
            menuId: el.menuId,
            permissionId: el.permissionId,
          })),
        },
      },
      transaction: option.t,
    });

    for (const discardedRoleAccess of discardedRoleAccesses) {
      await RoleAccessPersistence.destroy({
        where: {
          menuId: discardedRoleAccess.menuId,
          permissionId: discardedRoleAccess.permissionId,
          roleId: discardedRoleAccess.roleId,
        },
        force: true,
        transaction: option.t,
      });
    }

    // insert role access for super admin role
    for (const roleAccess of bulkRoleAccess) {
      await RoleAccessPersistence.findOrCreate({
        where: {
          menuId: roleAccess.menuId,
          permissionId: roleAccess.permissionId,
          roleId: roleAccess.roleId,
        },
        defaults: roleAccess,
        transaction: option.t,
      });
    }
  }

  async findAll(): Promise<Role[]> {
    const role = await RolePersistence.findAll();
    return role.map((el) => Role.create(el.toJSON()));
  }

  async findAllWithPagination(
    { q, orderBy, sortBy }: TStandardPaginationOption,
    pagination: Pagination
  ): Promise<[Role[], Pagination]> {
    orderBy && validateOrderByColumn(orderBy, VALID_ORDERBY_COLUMN.ROLE);
    const order: Order = [];
    if (orderBy) order.push([orderBy, sortBy!]);
    const { rows, count } = await RolePersistence.findAndCountAll({
      where: {
        ...(q && {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${q}%`,
              },
            },
          ],
        }),
      },
      limit: pagination.limit,
      offset: pagination.offset,
      order: order,
    });
    pagination.generateMeta(count, rows.length);
    return [rows.map((el) => Role.create(el.toJSON())), pagination];
  }

  async findById(id: string): Promise<Role> {
    const role = await RolePersistence.findByPk(id);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role not found",
      });
    }
    return Role.create(role.toJSON());
  }

  async update(id: string, props: IRole): Promise<Role> {
    const role = await RolePersistence.findByPk(id);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role not found",
      });
    }
    await role.update(props);

    // update role access to the latest based on the newest menu permission rules enabled menus
    const menuPermissionRules = await MenuPermissionRulePersistence.findAll({
      where: {
        isEnable: true,
      },
    });
    const bulkRoleAccess: IRoleAccess[] = menuPermissionRules.map((el) => ({
      menuId: el.menuId,
      permissionId: el.permissionId,
      roleId: role.id,
      status: false,
    }));

    // remove discarded / unused role access
    const discardedRoleAccesses = await RoleAccessPersistence.findAll({
      where: {
        roleId: role.id,
        [Op.not]: {
          [Op.and]: bulkRoleAccess.map((el) => ({
            menuId: el.menuId,
            permissionId: el.permissionId,
          })),
        },
      },
    });

    for (const discardedRoleAccess of discardedRoleAccesses) {
      await RoleAccessPersistence.destroy({
        where: {
          menuId: discardedRoleAccess.menuId,
          permissionId: discardedRoleAccess.permissionId,
          roleId: discardedRoleAccess.roleId,
        },
        force: true,
      });
    }

    // if new menus enabled then insert the role access for this role
    for (const roleAccess of bulkRoleAccess) {
      await RoleAccessPersistence.findOrCreate({
        where: {
          menuId: roleAccess.menuId,
          permissionId: roleAccess.permissionId,
          roleId: roleAccess.roleId,
        },
        defaults: roleAccess,
      });
    }
    return Role.create(role.toJSON());
  }
}
