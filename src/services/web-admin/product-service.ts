import { ProductRepository } from "@/domain/service/app-management/product-repository";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import ManagedTransactionService from "../managed-transaction-service";
import { TStandardPaginationOption } from "@/domain/service/types";
import { IProduct, Product } from "@/domain/models/app-management/product";
import { Pagination } from "@/domain/models/pagination";
import { Transaction } from "sequelize";

@injectable()
export class ProductSevice {
  constructor(
    @inject(TYPES.ProductRepository)
    private _productRepository: ProductRepository,
    @inject(TYPES.ManagedTransactionService)
    private _serviceTransaction: ManagedTransactionService
  ) {}

  public async findAll(
    params: TStandardPaginationOption
  ): Promise<[IProduct[], Pagination?]> {
    let pagination: Pagination | undefined = undefined;
    if (params.limit && params.page) {
      pagination = Pagination.create({
        page: params.page,
        limit: params.limit,
      });
      const [data, paginationResult] =
        await this._productRepository.findAllWithPagination(
          params,
          pagination,
          {}
        );
      return [data.map((el) => ({ ...el.unmarshal() })), paginationResult];
    }
    const products = await this._productRepository.findAll({});
    return [products.map((productType) => ({ ...productType.unmarshal() }))];
  }

  public async findById(id: string, t?: Transaction): Promise<IProduct> {
    let option: {} | { t: Transaction } = {};
    if (t) {
      option = { t };
    }
    const product = await this._productRepository.findById(id, option);
    return {
      ...product.unmarshal(),
    };
  }

  public async update(id: string, _product: IProduct): Promise<IProduct> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        const productProps = Product.create({
          ..._product,
          id,
        });

        const product = await this._productRepository.update(
          id,
          {
            name: productProps.name,
            imagePath: productProps.imagePath,
            price_buy: productProps.price_buy,
            price_sell: productProps.price_sell,
            stock: productProps.stock,
            unit: productProps.unit,
          },
          t ? { t } : {}
        );

        return { ...product.unmarshal() };
      },
      "Failed to update product"
    );
  }

  public async store(_product: IProduct, categoryId: string): Promise<void> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        const productData = Product.create({
          ..._product,

          categoryId,
        });
        await this._productRepository.create(
          productData.unmarshal(),
          t ? { t } : {}
        );
      },
      "Failed to store product"
    );
  }

  public async destroy(id: string): Promise<boolean> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        await this._productRepository.delete(id, t ? { t } : {});
        return true;
      },
      "Failed to destroy product"
    );
  }
}
