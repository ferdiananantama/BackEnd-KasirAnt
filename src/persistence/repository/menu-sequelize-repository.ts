import { injectable } from "inversify";
import { MenuRepository } from "@/domain/service/user-management/menu-repository";
import { IMenu, Menu } from "@/domain/models/user-management/menu";
import {
  Menu as MenuPersistence,
  MenuPermissionRule as MenuPermissionRulePersistence,
  RoleAccess as RoleAccessPersistence,
} from "@/infrastructure/database/models";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import { Pagination } from "@/domain/models/pagination";
import { Op } from "sequelize";
import { IMenuWithChildren } from "@/dto/menu-rule-dto";
import { MENU_SEED, IMenuSeedWithChildren, MENU_LIST } from "@/const";

@injectable()
export class MenuSequelizeRepository implements MenuRepository {
  async create(props: IMenu): Promise<Menu> {
    const menu = await MenuPersistence.create(props);
    return Menu.create(menu.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    const menu = await MenuPersistence.findByPk(id);
    if (!menu) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Menu not found",
      });
    }
    await menu.destroy();
    return true;
  }

  async seed(
    option: Partial<BaseQueryOption>,
    menuItems: IMenuSeedWithChildren[] = MENU_SEED,
    parentId: string | null = null,
    order: number = 1
  ): Promise<number> {
    // remove discarded / unused menus
    if (order === 1) {
      const discardedMenus = await MenuPersistence.findAll({
        where: {
          name: {
            [Op.notIn]: Object.keys(MENU_LIST),
          },
        },
        transaction: option.t,
        order: [["order", "DESC"]],
      });

      for (const discardedMenu of discardedMenus) {
        await MenuPermissionRulePersistence.destroy({
          where: {
            menuId: discardedMenu.id,
          },
          force: true,
          transaction: option.t,
        });
        await RoleAccessPersistence.destroy({
          where: {
            menuId: discardedMenu.id,
          },
          force: true,
          transaction: option.t,
        });
        await MenuPersistence.destroy({
          where: {
            id: discardedMenu.id,
          },
          force: true,
          transaction: option.t,
        });
      }
    }

    // inserting menu seed recursively
    for (const menuItem of menuItems) {
      const { name, children } = menuItem;
      const [menuInstance, created] = await MenuPersistence.findOrCreate({
        where: {
          name,
        },
        defaults: {
          name,
          order,
          parentId,
        },
        transaction: option.t,
      });

      if (!created) {
        menuInstance.order = order;
        menuInstance.parentId = parentId;
        await menuInstance.save({ transaction: option.t });
      }

      order++;

      if (children.length > 0) {
        const newOrder = await this.seed(
          { t: option.t },
          children,
          menuInstance.id,
          order
        );
        order += newOrder - order;
      }
    }
    return order;
  }

  async findAll(): Promise<Menu[]> {
    const menu = await MenuPersistence.findAll();
    return menu.map((el) => Menu.create(el.toJSON()));
  }

  async findAllWithPagination(
    { q }: TStandardPaginationOption,
    pagination: Pagination
  ): Promise<[Menu[], Pagination]> {
    const { rows, count } = await MenuPersistence.findAndCountAll({
      where: {
        ...(q && {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${q}%`,
              },
            },
          ],
        }),
      },
      limit: pagination.limit,
      offset: pagination.offset,
    });
    pagination.generateMeta(count, rows.length);
    return [rows.map((el) => Menu.create(el.toJSON())), pagination];
  }

  async findById(id: string): Promise<Menu> {
    const menu = await MenuPersistence.findByPk(id);
    if (!menu) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Menu not found",
      });
    }
    return Menu.create(menu.toJSON());
  }

  async update(id: string, props: IMenu): Promise<Menu> {
    const menu = await MenuPersistence.findByPk(id);
    if (!menu) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Menu not found",
      });
    }
    await menu.update(props);
    return Menu.create(menu.toJSON());
  }

  async getMenuWithChildren(): Promise<IMenuWithChildren[]> {
    const menus = await MenuPersistence.findAll({
      where: {
        parentId: null,
      },
      include: [MenuPersistence.associations.children],
      order: [["order", "ASC"]],
    });
    return menus.map((el) => ({
      ...el.toJSON(),
      children: el
        .children!.map((child) => child.toJSON())
        .sort((a, b) => a.order - b.order),
    }));
  }

  async findByField(
    param: {
      field: string;
      value: string | number;
    }[]
  ): Promise<Menu | undefined> {
    const found = await MenuPersistence.findOne({
      where: param.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.field]: curr.value,
        }),
        {}
      ),
    });
    if (found) {
      return Menu.create(found.toJSON());
    } else {
      return undefined;
    }
  }
}
