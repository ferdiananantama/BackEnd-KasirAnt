import { Entity, IBaseDomainProperty } from "@/domain/models/entity";
import { DefaultEntityBehaviour } from "@/domain/service/types";

export interface IRoleAccess extends Omit<IBaseDomainProperty, "deletedAt"> {
  roleId: string;
  menuId: string;
  permissionId: string;
  status: boolean;
}

export class RoleAccess
  extends Entity<IRoleAccess>
  implements DefaultEntityBehaviour<IRoleAccess>
{
  private constructor(props: IRoleAccess) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IRoleAccess) {
    return new RoleAccess(props);
  }

  unmarshal(): IRoleAccess {
    return {
      id: this.id,
      menuId: this.menuId,
      permissionId: this.permissionId,
      roleId: this.roleId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id(): string {
    return this._id;
  }
  get menuId(): string {
    return this.props.menuId;
  }
  get permissionId(): string {
    return this.props.permissionId;
  }
  get roleId(): string {
    return this.props.roleId;
  }
  get status(): boolean {
    return this.props.status;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
