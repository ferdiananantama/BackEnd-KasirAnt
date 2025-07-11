import { IMenu } from "@/domain/models/user-management/menu";
import { IPermission } from "@/domain/models/user-management/permission";
import { IMenuPermissionRule } from "@/domain/models/user-management/menu-permission-rule";

export interface IMenuWithChildren extends IMenu {
  children: IMenu[];
}

interface IPlainPermission
  extends Omit<IPermission, "createdAt" | "deletedAt" | "updatedAt"> {
  isEnabled: boolean;
}

export interface IMenuRule {
  id: string;
  name: string;
  permissions: IPlainPermission[];
  children?: IMenuRule[];
}

export interface IMenuPermissionPlain
  extends Pick<IMenuPermissionRule, "permissionId" | "menuId"> {}
