import BaseRepository from "@/domain/service/base-repository";
import { IMenu, Menu } from "@/domain/models/user-management/menu";
import { IMenuWithChildren } from "@/dto/menu-rule-dto";
import { BaseQueryOption } from "@/domain/service/types";
import { IMenuSeedWithChildren } from "@/const";

export interface MenuRepository extends BaseRepository<Menu, IMenu> {
  seed(
    option: Partial<BaseQueryOption>,
    menuItems?: IMenuSeedWithChildren[],
    parentId?: string | null,
    order?: number
  ): Promise<number>;
  getMenuWithChildren(): Promise<IMenuWithChildren[]>;
  findByField(
    param: { field: string; value: string | number }[]
  ): Promise<Menu | undefined>;
}
