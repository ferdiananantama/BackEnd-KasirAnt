import { IRoleAccess } from "@/domain/models/user-management/role-access";

export interface IPlainRoleAccess
  extends Pick<IRoleAccess, "menuId" | "permissionId" | "status"> {}
