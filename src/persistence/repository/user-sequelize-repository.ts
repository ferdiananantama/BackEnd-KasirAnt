import { injectable } from "inversify";
import { UserRepository } from "@/domain/service/user-management/user-repository";
import { IUser, User } from "@/domain/models/user-management/user";
import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import {
  User as UserPersistence,
  Role as RolePersistence,
  Company as CompanyPersistance,
} from "@/infrastructure/database/models";
import { Pagination } from "@/domain/models/pagination";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { Op, Order } from "sequelize";
import { SEED_USER_ADMIN, SUPER_ADMIN_ROLE } from "@/const";
import { validateOrderByColumn } from "@/libs/formatters";
import { VALID_ORDERBY_COLUMN } from "@/const";

@injectable()
export class UserSequelizeRepository implements UserRepository {
  async create(props: IUser, option: Partial<BaseQueryOption>): Promise<User> {
    const data = await UserPersistence.create(props, { transaction: option.t });
    return User.create(data.toJSON());
  }

  async delete(id: string, option: Partial<BaseQueryOption>): Promise<boolean> {
    const data = await UserPersistence.findByPk(id, { transaction: option.t });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User not found!!",
      });
    }
    try {
      await data.destroy({ force: true, transaction: option.t });
    } catch (err) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Resources already used in transaction",
      });
    }
    return true;
  }

  async findAll(option: Partial<BaseQueryOption>): Promise<User[]> {
    const data = await UserPersistence.findAll({
      include: [
        { model: RolePersistence, as: "role" },
        { model: CompanyPersistance, as: "company" },
      ],
      transaction: option.t,
    });
    return data.map((el) => User.create(el.toJSON()));
  }

  async findAllWithPagination(
    { q, orderBy, sortBy }: TStandardPaginationOption,
    pagination: Pagination,
    queryOption: Partial<BaseQueryOption>
  ): Promise<[User[], Pagination]> {
    orderBy && validateOrderByColumn(orderBy, VALID_ORDERBY_COLUMN.USER);
    const order: Order = [];
    switch (orderBy) {
      case "role":
        order.push([{ model: RolePersistence, as: "role" }, "name", sortBy!]);
        break;
      default:
        if (orderBy) order.push([orderBy, sortBy!]);
        break;
    }
    const { rows: data, count } = await UserPersistence.findAndCountAll({
      include: [{ model: RolePersistence, as: "role" }],
      where: {
        ...(q && {
          [Op.or]: [
            {
              fullname: {
                [Op.iLike]: `%${q}%`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${q}%`,
              },
            },
            {
              "$role.name$": {
                [Op.iLike]: `%${q}%`,
              },
            },
          ],
        }),
      },
      offset: pagination.offset,
      limit: pagination.limit,
      transaction: queryOption.t,
      order: order,
    });
    pagination.generateMeta(count, data.length);
    return [data.map((el) => User.create(el.toJSON())), pagination];
  }

  async findById(id: string, option: Partial<BaseQueryOption>): Promise<User> {
    const data = await UserPersistence.findByPk(id, {
      include: [
        { model: RolePersistence, as: "role" },
        { model: CompanyPersistance, as: "company" },
      ],
      transaction: option.t,
    });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User not found!!",
      });
    }
    return User.create(data.toJSON());
  }

  async update(
    id: string,
    props: IUser,
    option: Partial<BaseQueryOption>
  ): Promise<User> {
    const data = await UserPersistence.findByPk(id, { transaction: option.t });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User not found!!",
      });
    }
    await data.update(props, { transaction: option.t });
    return User.create(data.toJSON());
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await UserPersistence.findOne({
      include: [{ model: RolePersistence, as: "role" }],
      where: {
        email: {
          [Op.iLike]: email,
        },
      },
    });
    return data ? User.create(data.toJSON()) : null;
  }

  async seedAdmin(option: Partial<BaseQueryOption>): Promise<void> {
    const role = await RolePersistence.findOne({
      where: {
        name: SUPER_ADMIN_ROLE,
      },
      transaction: option.t,
    });
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Super admin role not found!!",
      });
    }
    const admin = User.create({
      ...SEED_USER_ADMIN,
      roleId: role.id,
      password: undefined,
      passwordLastUpdatedAt: new Date(),
      isActive: true,
    });
    admin.password = SEED_USER_ADMIN.password;
    await UserPersistence.findOrCreate({
      where: {
        email: SEED_USER_ADMIN.email,
      },
      defaults: admin.unmarshal(),
      transaction: option.t,
    });
  }
}
