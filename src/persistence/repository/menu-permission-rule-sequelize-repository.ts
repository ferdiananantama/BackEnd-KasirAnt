import { injectable } from "inversify";
import { MenuPermissionRuleRepository } from "@/domain/service/user-management/menu-permission-rule-repository";
import {
  Menu as MenuPersistence,
  MenuPermissionRule as MenuPermissionRulePersistence,
  Permission as PermissionPersistence,
} from "@/infrastructure/database/models";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import MenuPermissionRule from "@/domain/models/user-management/menu-permission-rule";
import { IMenuPermissionPlain } from "@/dto/menu-rule-dto";
import { ENABLED_MENU_PERMISSION_RULE, TMenuList } from "@/const";
import { BaseQueryOption } from "@/domain/service/types";

@injectable()
export class MenuPermissionRuleSequelizeRepository
  implements MenuPermissionRuleRepository
{
  async getByMenuAndPermission(
    props: IMenuPermissionPlain
  ): Promise<MenuPermissionRule> {
    const rule = await MenuPermissionRulePersistence.findOne({
      where: {
        menuId: props.menuId,
        permissionId: props.permissionId,
      },
    });
    if (!rule) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Menu Permission rule not found",
      });
    }
    return MenuPermissionRule.create(rule.toJSON());
  }

  async getById(id: string): Promise<MenuPermissionRule> {
    const rule = await MenuPermissionRulePersistence.findByPk(id);
    if (!rule) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Menu Permission rule not found",
      });
    }
    return MenuPermissionRule.create(rule.toJSON());
  }

  async changeStatus({
    id,
    status,
  }: {
    id: string;
    status: boolean;
  }): Promise<boolean> {
    const rule = await MenuPermissionRulePersistence.findByPk(id);
    if (!rule) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Menu Permission rule not found",
      });
    }
    await rule.update({ isEnable: status });
    return true;
  }

  async getRules(): Promise<void> {}

  async seed(option: Partial<BaseQueryOption>): Promise<void> {
    const permissions = await PermissionPersistence.findAll({
      transaction: option.t,
    });
    const menus = await MenuPersistence.findAll({ transaction: option.t });
    for (const menu of menus) {
      for (const permission of permissions) {
        const [row] = await MenuPermissionRulePersistence.findOrCreate({
          where: {
            menuId: menu.id,
            permissionId: permission.id,
          },
          defaults: {
            menuId: menu.id,
            permissionId: permission.id,
            isEnable: false,
          },
          transaction: option.t,
        });

        row.isEnable = false;
        await row.save({ transaction: option.t });

        for (const key in ENABLED_MENU_PERMISSION_RULE) {
          if (menu.name.toUpperCase() === key.toUpperCase()) {
            for (const permissionType of ENABLED_MENU_PERMISSION_RULE[
              key as TMenuList
            ]) {
              if (permissionType === permission.name) {
                row.isEnable = true;
                await row.save({ transaction: option.t });
                break;
              }
            }
          }
        }
      }
    }
  }

  async getAll(): Promise<MenuPermissionRule[]> {
    const rules = await MenuPermissionRulePersistence.findAll();
    return rules.map((el) => MenuPermissionRule.create(el.toJSON()));
  }

  async getMenuPermissionsByMenuId(
    menuId: string
  ): Promise<MenuPermissionRule[]> {
    const menuPermissionRules = await MenuPermissionRulePersistence.findAll({
      where: {
        menuId: menuId,
        isEnable: true,
      },
    });
    return menuPermissionRules.map((el) =>
      MenuPermissionRule.create(el.toJSON())
    );
  }
}
