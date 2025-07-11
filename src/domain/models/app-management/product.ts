import { Category } from "@/infrastructure/database/models";
import { Entity, IBaseDomainProperty } from "../entity";

export interface IProduct extends IBaseDomainProperty {
  name: string;
  imagePath: string | null | undefined;
  price_buy: number;
  price_sell: number;
  category?: Category | null;
  categoryId?: string | null;
  stock: number;
  unit: string;
}

export class Product extends Entity<IProduct> {
  private constructor(props: IProduct) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IProduct): Product {
    return new Product(props);
  }

  public unmarshal(): IProduct {
    return {
      id: this._id,
      name: this.props.name,
      imagePath: this.props.imagePath,
      price_buy: this.props.price_buy,
      price_sell: this.props.price_sell,
      categoryId: this.props.categoryId,
      category: this.props.category,
      stock: this.props.stock,
      unit: this.props.unit,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      deletedAt: this.props.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get imagePath(): string | null | undefined {
    return this.props.imagePath;
  }

  get price_buy(): number {
    return this.props.price_buy;
  }

  get price_sell(): number {
    return this.props.price_sell;
  }

  get stock(): number {
    return this.props.stock;
  }

  get unit(): string {
    return this.props.unit;
  }

  get category(): Category | null | undefined {
    return this.props.category;
  }

  get categoryId(): string | null | undefined {
    return this.props.categoryId;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined | null {
    return this.props.deletedAt;
  }
}
