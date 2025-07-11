import { Entity, IBaseDomainProperty } from "@/domain/models/entity";
import { DefaultEntityBehaviour } from "@/domain/service/types";

export interface IMenu extends IBaseDomainProperty {
  name: string;
  order: number;
  parentId: null | string;
}

export class Menu
  extends Entity<IMenu>
  implements DefaultEntityBehaviour<IMenu>
{
  private constructor(props: IMenu) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IMenu): Menu {
    return new Menu(props);
  }

  unmarshal(): IMenu {
    return {
      id: this.id,
      name: this.name,
      order: this.order,
      parentId: this.parentId,
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
  get order(): number {
    return this.props.order;
  }
  get parentId(): string | null {
    return this.props.parentId;
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
