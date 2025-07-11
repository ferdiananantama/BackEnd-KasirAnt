import { TPermissionList } from "@/const";
import { Entity, IBaseDomainProperty } from "@/domain/models/entity";
import { DefaultEntityBehaviour } from "@/domain/service/types";

export interface IPermission extends IBaseDomainProperty {
  name: TPermissionList;
}

export class Permission
  extends Entity<IPermission>
  implements DefaultEntityBehaviour<IPermission>
{
  private constructor(props: IPermission) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IPermission): Permission {
    return new Permission(props);
  }

  unmarshal(): IPermission {
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
  get name(): TPermissionList {
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
