import { Category, ICategory } from "@/domain/models/app-management/category";
import { Pagination } from "@/domain/models/pagination";
import { CategoryRepository } from "@/domain/service/app-management/category-repository";
import { TStandardPaginationOption } from "@/domain/service/types";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { Transaction } from "sequelize";
import ManagedTransactionService from "../managed-transaction-service";

@injectable()
export class CategoryService {
  constructor(
    @inject(TYPES.CategoryRepository)
    private _categoryRepository: CategoryRepository,
    @inject(TYPES.ManagedTransactionService)
    private _serviceTransaction: ManagedTransactionService
  ) {}

  public async findAll(
    params: TStandardPaginationOption
  ): Promise<[ICategory[], Pagination?]> {
    let pagination: Pagination | undefined = undefined;
    if (params.limit && params.page) {
      pagination = Pagination.create({
        page: params.page,
        limit: params.limit,
      });
      const [data, paginationResult] =
        await this._categoryRepository.findAllWithPagination(
          params,
          pagination,
          {}
        );
      return [data.map((el) => ({ ...el.unmarshal() })), paginationResult];
    }
    const categories = await this._categoryRepository.findAll({});
    return [
      categories.map((categoryType) => ({ ...categoryType.unmarshal() })),
    ];
  }

  public async findById(id: string, t?: Transaction): Promise<ICategory> {
    let option: {} | { t: Transaction } = {};
    if (t) {
      option = { t };
    }
    const category = await this._categoryRepository.findById(id, option);
    return {
      ...category.unmarshal(),
    };
  }

  public async update(id: string, _category: ICategory): Promise<ICategory> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        const categoryProps = Category.create({
          ..._category,
          id,
        });

        const category = await this._categoryRepository.update(
          id,
          {
            name: categoryProps.name,
            description: categoryProps.description,
          },
          t ? { t } : {}
        );

        return { ...category.unmarshal() };
      },
      "Failed to update category"
    );
  }

  public async store(
    _category: ICategory,
    t?: Transaction
  ): Promise<ICategory> {
    const categoryData = Category.create({
      ..._category,
    });

    const category = await this._categoryRepository.create(
      categoryData.unmarshal(),
      t ? { t } : {}
    );

    return {
      ...category.unmarshal(),
    };
  }

  public async destroy(id: string): Promise<boolean> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        await this._categoryRepository.delete(id, t ? { t } : {});
        return true;
      },
      "Failed to destroy category"
    );
  }
}
