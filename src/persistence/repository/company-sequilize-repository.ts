import { ICompany, Company } from "@/domain/models/app-management/company";
import { CompanyRepository } from "@/domain/service/app-management/company-repository";
import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { Company as CompanyPersistence } from "@/infrastructure/database/models/company-sequelize";
import { Pagination } from "@/domain/models/pagination";
import { Op, Order } from "sequelize";
import { VALID_ORDERBY_COLUMN } from "@/const";
import { validateOrderByColumn } from "@/libs/formatters";

@injectable()
export class CompanySequelizeRepository implements CompanyRepository {
  async create(
    props: ICompany,
    option: Partial<BaseQueryOption>
  ): Promise<Company> {
    const data = await CompanyPersistence.create(
      { ...props, logoPath: props.logoPath ?? "" },
      {
        transaction: option.t,
      }
    );
    return Company.create(data.toJSON());
  }

  async findAll(option: Partial<BaseQueryOption>): Promise<Company[]> {
    const data = CompanyPersistence.findAll({
      transaction: option.t,
    });
    return data.then((companies) =>
      companies.map((company) => Company.create(company.toJSON()))
    );
  }

  async findAllWithPagination(
    option: TStandardPaginationOption,
    pagination: Pagination,
    queryOption: Partial<BaseQueryOption>
  ): Promise<[Company[], Pagination]> {
    const { q, orderBy, sortBy } = option;
    orderBy && validateOrderByColumn(orderBy, VALID_ORDERBY_COLUMN.COMPANY);
    const order: Order = [];
    switch (orderBy) {
      case "name":
        order.push([
          { model: CompanyPersistence, as: "company" },
          "name",
          sortBy!,
        ]);
        break;
      default:
        if (orderBy) order.push([orderBy, sortBy!]);
        break;
    }

    const { rows: data, count } = await CompanyPersistence.findAndCountAll({
      where: {
        ...(q && {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { address: { [Op.like]: `%${q}%` } },
          ],
        }),
      },
      offset: pagination.offset,
      limit: pagination.limit,
      transaction: queryOption.t,
    });
    pagination.generateMeta(count, data.length);
    return [data.map((el) => Company.create(el.toJSON())), pagination];
  }

  async delete(id: string, option: Partial<BaseQueryOption>): Promise<boolean> {
    const data = await CompanyPersistence.findByPk(id, {
      transaction: option.t,
    });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Company not found!!",
      });
    }
    try {
      await data.destroy({ transaction: option.t, force: true });
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to delete company",
      });
    }
    return true;
  }

  async update(
    id: string,
    props: ICompany,
    option: Partial<BaseQueryOption>
  ): Promise<Company> {
    const data = await CompanyPersistence.findByPk(id, {
      transaction: option.t,
    });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Company not found!!",
      });
    }
    await data.update(
      {
        name: props.name,
        address: props.address,
        logoPath: props.logoPath ?? "",
      },
      {
        transaction: option.t,
      }
    );
    return Company.create(data.toJSON());
  }

  async findById(
    id: string,
    option: Partial<BaseQueryOption>
  ): Promise<Company> {
    const data = await CompanyPersistence.findByPk(id, {
      transaction: option.t,
    });
    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Company not found!!",
      });
    }
    return Company.create(data.toJSON());
  }

  async seedCompany(option: Partial<BaseQueryOption>): Promise<void> {
    const company = Company.create({
      name: "Company 1",
      logoPath: "https://via.placeholder.com/150",
      address: "123 Street, New York, NY 10001",
    });
    await CompanyPersistence.findOrCreate({
      where: {
        name: company.name,
      },
      defaults: {
        ...company.unmarshal(),
        logoPath: company.logoPath ?? "",
      },
      transaction: option.t,
    });
  }
}
