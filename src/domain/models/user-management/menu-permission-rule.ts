import { Entity, IBaseDomainProperty } from "@/domain/models/entity";
import { DefaultEntityBehaviour } from "@/domain/service/types";

export interface IMenuPermissionRule
  extends Omit<IBaseDomainProperty, "deletedAt"> {
  menuId: string;
  permissionId: string;
  isEnable: boolean;
}

export default class MenuPermissionRule
  extends Entity<IMenuPermissionRule>
  implements DefaultEntityBehaviour<IMenuPermissionRule>
{
  private constructor(props: IMenuPermissionRule) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IMenuPermissionRule): MenuPermissionRule {
    return new MenuPermissionRule(props);
  }

  unmarshal(): IMenuPermissionRule {
    return {
      id: this.id,
      menuId: this.menuId,
      permissionId: this.permissionId,
      isEnable: this.isEnable,
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
  get isEnable(): boolean {
    return this.props.isEnable;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
