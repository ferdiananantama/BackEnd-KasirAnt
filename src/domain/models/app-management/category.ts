import { Entity, IBaseDomainProperty } from "../entity";

export interface ICategory extends IBaseDomainProperty {
  name: string;
  description?: string;
}

export class Category extends Entity<ICategory> {
  private constructor(props: ICategory) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: ICategory): Category {
    return new Category(props);
  }

  public unmarshal(): ICategory {
    return {
      id: this._id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
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
