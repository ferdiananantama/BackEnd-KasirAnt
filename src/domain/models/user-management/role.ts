import { Entity, IBaseDomainProperty } from "@/domain/models/entity";
import { DefaultEntityBehaviour } from "@/domain/service/types";

export interface IRole extends IBaseDomainProperty {
  name: string;
}

export class Role
  extends Entity<IRole>
  implements DefaultEntityBehaviour<IRole>
{
  private constructor(props: IRole) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IRole): Role {
    return new Role(props);
  }

  unmarshal(): IRole {
    return {
      id: this.id,
      name: this.name,
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
