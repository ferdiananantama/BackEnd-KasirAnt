import {
  IRoleAccess,
  RoleAccess,
} from "@/domain/models/user-management/role-access";

export interface RoleAccessRepository {
  getByRole(roleId: string): Promise<RoleAccess[]>;

  getByRoleMenu(roleId: string, menuId: string): Promise<RoleAccess[]>;

  getByRoleMenuPermission(
    roleId: string,
    menuId: string,
    permissionId: string
  ): Promise<RoleAccess | null>;

  create(props: IRoleAccess): Promise<RoleAccess>;

  bulkCreate(props: IRoleAccess[]): Promise<RoleAccess[]>;

  bulkUpsert(props: IRoleAccess[]): Promise<RoleAccess[]>;

  destroy(id: string): Promise<boolean>;

  bulkDestroy(ids: string[]): Promise<boolean>;
}
