import { VALID_ORDERBY_COLUMN } from "@/const";
import { IProduct, Product } from "@/domain/models/app-management/product";
import { Pagination } from "@/domain/models/pagination";
import { ProductRepository } from "@/domain/service/app-management/product-repository";
import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import { Product as ProductPersistence } from "@/infrastructure/database/models";
import { Category as CategoryPersistence } from "@/infrastructure/database/models/category-sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { validateOrderByColumn } from "@/libs/formatters";
import { injectable } from "inversify";
import { Op, Order } from "sequelize";

@injectable()
export class ProductSequelizeRepository implements ProductRepository {
  async create(
    props: IProduct,
    optional: Partial<BaseQueryOption>
  ): Promise<Product> {
    const data = await ProductPersistence.create(
      {
        ...props,
        categoryId: props.categoryId === null ? undefined : props.categoryId,
      },
      {
        transaction: optional.t,
      }
    );
    return Product.create(data.toJSON());
  }

  findAll(option: Partial<BaseQueryOption>): Promise<Product[]> {
    const data = ProductPersistence.findAll({
      include: [{ model: CategoryPersistence, as: "category" }],
      transaction: option.t,
    });
    return data.then((products) =>
      products.map((product) => Product.create(product.toJSON()))
    );
  }

  async findAllWithPagination(
    option: TStandardPaginationOption,
    pagination: Pagination,
    queryOption: Partial<BaseQueryOption>
  ): Promise<[Product[], Pagination]> {
    const { q, orderBy, sortBy } = option;
    orderBy && validateOrderByColumn(orderBy, VALID_ORDERBY_COLUMN.PRODUCT);
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

    const { rows: data, count } = await ProductPersistence.findAndCountAll({
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
    return [
      data.map((product) => Product.create(product.toJSON())),
      pagination,
    ];
  }

  async delete(id: string, option: Partial<BaseQueryOption>): Promise<boolean> {
    const data = await ProductPersistence.findByPk(id, {
      transaction: option.t,
    });

    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Product not found",
      });
    }

    try {
      await data.destroy({ transaction: option.t, force: true });
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to delete product",
      });
    }
    return true;
  }

  async update(
    id: string,
    props: IProduct,
    option: Partial<BaseQueryOption>
  ): Promise<Product> {
    const data = await ProductPersistence.findByPk(id, {
      transaction: option.t,
    });

    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Product not found",
      });
    }

    await data.update(
      {
        ...props,
        categoryId: props.categoryId === null ? undefined : props.categoryId,
      },
      { transaction: option.t }
    );

    return Product.create(data.toJSON());
  }

  async findById(
    id: string,
    option: Partial<BaseQueryOption>
  ): Promise<Product> {
    const data = await ProductPersistence.findByPk(id, {
      include: [
        {
          model: CategoryPersistence,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      transaction: option.t,
    });

    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Product not found",
      });
    }
    return Product.create(data.toJSON());
  }
}
