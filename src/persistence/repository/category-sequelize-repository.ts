import { ICategory, Category } from "@/domain/models/app-management/category";
import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import { injectable } from "inversify";
import { Category as CategoryPersistence } from "@/infrastructure/database/models/category-sequelize";
import { CategoryRepository } from "@/domain/service/app-management/category-repository";
import { Pagination } from "@/domain/models/pagination";
import { validateOrderByColumn } from "@/libs/formatters";
import { VALID_ORDERBY_COLUMN } from "@/const";
import { Op, Order } from "sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export class CategorySequelizeRepository implements CategoryRepository {
  async create(
    props: ICategory,
    optional: Partial<BaseQueryOption>
  ): Promise<Category> {
    const data = await CategoryPersistence.create(props, {
      transaction: optional.t,
    });
    return Category.create(data.toJSON());
  }

  findAll(option: Partial<BaseQueryOption>): Promise<Category[]> {
    const data = CategoryPersistence.findAll({
      // include: [{ model: CategoryPersistence, as: "category" }],
      transaction: option.t,
    });
    return data.then((categories) =>
      categories.map((category) => Category.create(category.toJSON()))
    );
  }

  async findAllWithPagination(
    option: TStandardPaginationOption,
    pagination: Pagination,
    queryOption: Partial<BaseQueryOption>
  ): Promise<[Category[], Pagination]> {
    const { q, orderBy, sortBy } = option;
    orderBy && validateOrderByColumn(orderBy, VALID_ORDERBY_COLUMN.CATEGORY);
    const order: Order = [];
    switch (orderBy) {
      case "name":
        order.push([
          { model: CategoryPersistence, as: "category" },
          "name",
          sortBy!,
        ]);
        break;
      default:
        if (orderBy) order.push([orderBy, sortBy!]);
        break;
    }

    const { rows: data, count } = await CategoryPersistence.findAndCountAll({
      include: [{ model: CategoryPersistence, as: "category" }],
      where: {
        ...(q && {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
          ],
        }),
      },
      order: order,
      offset: pagination.offset,
      limit: pagination.limit,
      transaction: queryOption.t,
    });
    pagination.generateMeta(count, data.length);
    return [data.map((el) => Category.create(el.toJSON())), pagination];
  }

  async delete(id: string, option: Partial<BaseQueryOption>): Promise<boolean> {
    const data = await CategoryPersistence.findByPk(id, {
      transaction: option.t,
    });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Category not found!!",
      });
    }
    try {
      await data.destroy({ transaction: option.t, force: true });
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to delete category",
      });
    }
    return true;
  }

  async update(
    id: string,
    props: ICategory,
    option: Partial<BaseQueryOption>
  ): Promise<Category> {
    const data = await CategoryPersistence.findByPk(id, {
      transaction: option.t,
    });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Category not found!!",
      });
    }
    await data.update(props, { transaction: option.t });
    return Category.create(data.toJSON());
  }

  async findById(
    id: string,
    option: Partial<BaseQueryOption>
  ): Promise<Category> {
    const data = await CategoryPersistence.findByPk(id, {
      // include: [{ model: CategoryPersistence, as: "category" }],
      transaction: option.t,
    });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Category not found!!",
      });
    }
    return Category.create(data.toJSON());
  }
}
