import { injectable } from "inversify";
import PermissionRepository from "@/domain/service/user-management/permission-repository";
import {
  IPermission,
  Permission,
} from "@/domain/models/user-management/permission";
import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import { Pagination } from "@/domain/models/pagination";
import {
  Permission as PermissionPersistence,
  MenuPermissionRule as MenuPermissionRulePersistence,
  RoleAccess as RoleAccessPersistence,
} from "@/infrastructure/database/models";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { Op } from "sequelize";
import { PermissionList, TPermissionList } from "@/const";

@injectable()
export class PermissionSequelizeRepository implements PermissionRepository {
  async findByField(
    param: {
      field: string;
      value: string | number;
    }[]
  ): Promise<Permission | undefined> {
    const found = await PermissionPersistence.findOne({
      where: param.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.field]: curr.value,
        }),
        {}
      ),
    });
    if (found) {
      return Permission.create(found.toJSON());
    } else {
      return undefined;
    }
  }
  async create(props: IPermission): Promise<Permission> {
    const permission = await PermissionPersistence.create(props);
    return Permission.create(permission.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    const permission = await PermissionPersistence.findByPk(id);
    if (!permission) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Permission not found",
      });
    }
    await permission.destroy();
    return true;
  }

  async seed(option: Partial<BaseQueryOption>): Promise<void> {
    // remove discarded / unused permissions
    const discardedPermissions = await PermissionPersistence.findAll({
      where: {
        name: {
          [Op.notIn]: Object.keys(PermissionList),
        },
      },
      transaction: option.t,
    });

    for (const discardedPermission of discardedPermissions) {
      await MenuPermissionRulePersistence.destroy({
        where: {
          permissionId: discardedPermission.id,
        },
        force: true,
        transaction: option.t,
      });
      await RoleAccessPersistence.destroy({
        where: {
          permissionId: discardedPermission.id,
        },
        force: true,
        transaction: option.t,
      });
      await PermissionPersistence.destroy({
        where: {
          id: discardedPermission.id,
        },
        force: true,
        transaction: option.t,
      });
    }

    // inserting permission seed
    for (const name in PermissionList) {
      await PermissionPersistence.findOrCreate({
        where: {
          name: name as TPermissionList,
        },
        defaults: {
          name: name as TPermissionList,
        },
        transaction: option.t,
      });
    }
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await PermissionPersistence.findAll();
    return permissions.map((el) => Permission.create(el.toJSON()));
  }

  async findAllWithPagination(
    { q }: TStandardPaginationOption,
    pagination: Pagination
  ): Promise<[Permission[], Pagination]> {
    const { rows, count } = await PermissionPersistence.findAndCountAll({
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
    });
    pagination.generateMeta(count, rows.length);
    return [rows.map((el) => Permission.create(el.toJSON())), pagination];
  }

  async findById(id: string): Promise<Permission> {
    const permission = await PermissionPersistence.findByPk(id);
    if (!permission) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Permission not found",
      });
    }
    return Permission.create(permission.toJSON());
  }

  async update(id: string, props: IPermission): Promise<Permission> {
    const permission = await PermissionPersistence.findByPk(id);
    if (!permission) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Permission not found",
      });
    }
    await permission.update({
      ...props,
    });
    return Permission.create(permission.toJSON());
  }
}
