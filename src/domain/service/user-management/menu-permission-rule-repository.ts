import MenuPermissionRule from "@/domain/models/user-management/menu-permission-rule";
import { IMenuPermissionPlain } from "@/dto/menu-rule-dto";
import { BaseQueryOption } from "@/domain/service/types";

export interface MenuPermissionRuleRepository {
  getAll(): Promise<MenuPermissionRule[]>;
  seed(option: Partial<BaseQueryOption>): Promise<void>;
  changeStatus({
    id,
    status,
  }: {
    id: string;
    status: boolean;
  }): Promise<boolean>;
  getRules(): Promise<void>;
  getById(id: string): Promise<MenuPermissionRule>;
  getByMenuAndPermission(
    props: IMenuPermissionPlain
  ): Promise<MenuPermissionRule>;
  getMenuPermissionsByMenuId(menuId: string): Promise<MenuPermissionRule[]>;
}
