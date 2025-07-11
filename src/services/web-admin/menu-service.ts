import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { MenuRepository } from "@/domain/service/user-management/menu-repository";
import { TStandardPaginationOption } from "@/domain/service/types";
import { IMenu } from "@/domain/models/user-management/menu";
import { Pagination } from "@/domain/models/pagination";
import { MenuPermissionRuleRepository } from "@/domain/service/user-management/menu-permission-rule-repository";
import PermissionRepository from "@/domain/service/user-management/permission-repository";
import { IMenuPermissionPlain, IMenuRule } from "@/dto/menu-rule-dto";
import { Transaction } from "sequelize";
import { IRole } from "@/domain/models/user-management/role";
import { RoleRepository } from "@/domain/service/user-management/role-repository";
import { RoleAccessRepository } from "@/domain/service/user-management/role-access-repository";
import { IRoleAccess } from "@/domain/models/user-management/role-access";
import { IPlainRoleAccess } from "@/dto/role-access-dto";
import ManagedTransactionService from "@/services/managed-transaction-service";

@injectable()
export class MenuService {
  constructor(
    @inject(TYPES.MenuRepository) private _repository: MenuRepository,
    @inject(TYPES.MenuPermissionRuleRepository)
    private _menuPermissionRuleRepository: MenuPermissionRuleRepository,
    @inject(TYPES.PermissionRepository)
    private _permissionRepository: PermissionRepository,
    @inject(TYPES.RoleRepository)
    private _roleRepository: RoleRepository,
    @inject(TYPES.RoleAccessRepository)
    private _roleAccessRepository: RoleAccessRepository,
    @inject(TYPES.ManagedTransactionService)
    private _serviceTransaction: ManagedTransactionService
  ) {}

  public async findAll(
    options?: TStandardPaginationOption
  ): Promise<[IMenu[], Pagination?]> {
    if (options?.q || (options?.page && options?.limit)) {
      const pagination = Pagination.create({
        page: <number>options.page,
        limit: <number>options.limit,
      });
      const [rows, paginateResult] =
        await this._repository.findAllWithPagination(options, pagination, {});
      return [rows.map((el) => el.unmarshal()), paginateResult];
    }
    return [(await this._repository.findAll({})).map((el) => el.unmarshal())];
  }

  public async findById(id: string, t?: Transaction): Promise<IMenu> {
    return (await this._repository.findById(id, t ? { t } : {})).unmarshal();
  }

  public async create(props: IMenu, t?: Transaction): Promise<IMenu> {
    return (await this._repository.create(props, t ? { t } : {})).unmarshal();
  }

  public async update(
    id: string,
    props: IMenu,
    t?: Transaction
  ): Promise<IMenu> {
    return (
      await this._repository.update(id, props, t ? { t } : {})
    ).unmarshal();
  }

  public async destroy(id: string, t?: Transaction): Promise<boolean> {
    return await this._repository.delete(id, t ? { t } : {});
  }

  public async seed(): Promise<void> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        await this._repository.seed({ t });
        await this._permissionRepository.seed({ t });
        await this._menuPermissionRuleRepository.seed({ t });
      },
      "Failed to seed menu, permission, and menu permission rule"
    );
  }

  public async getMenuRule(): Promise<IMenuRule[]> {
    const menus = await this._repository.getMenuWithChildren();
    const [permissions] = [
      (await this._permissionRepository.findAll({})).map((el) =>
        el.unmarshal()
      ),
    ];
    const rules = (await this._menuPermissionRuleRepository.getAll()).map(
      (el) => el.unmarshal()
    );
    return menus.map((menu) => ({
      id: menu.id!,
      name: menu.name,
      permissions: permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        isEnabled: !!rules.find(
          (rule) =>
            rule.permissionId === permission.id && rule.menuId === menu.id
        )?.isEnable,
      })),
      children: menu.children.map((child) => ({
        id: child.id!,
        name: child.name,
        permissions: permissions.map((permission) => ({
          id: permission.id,
          name: permission.name,
          isEnabled: !!rules.find(
            (rule) =>
              rule.permissionId === permission.id && rule.menuId === child.id
          )?.isEnable,
        })),
      })),
    }));
  }

  public async changeMenuPermissionStatus(
    props: IMenuPermissionPlain,
    status: boolean
  ): Promise<boolean> {
    const rule =
      await this._menuPermissionRuleRepository.getByMenuAndPermission(props);
    return await this._menuPermissionRuleRepository.changeStatus({
      id: rule.id,
      status,
    });
  }

  public async getRoleAccessesByRoleId(
    roleId: string
  ): Promise<[IMenuRule[], IPlainRoleAccess[], IRole]> {
    const role = await this._roleRepository.findById(roleId, {});
    const menus = await this._repository.getMenuWithChildren();
    const [permissions] = [
      (await this._permissionRepository.findAll({})).map((el) =>
        el.unmarshal()
      ),
    ];
    const rules = (await this._menuPermissionRuleRepository.getAll()).map(
      (el) => el.unmarshal()
    );
    const roleAccesses = (
      await this._roleAccessRepository.getByRole(roleId)
    ).map((el) => el.unmarshal());
    return [
      menus.map((menu) => ({
        id: menu.id!,
        name: menu.name,
        permissions: permissions
          .map((permission) => ({
            id: permission.id,
            name: permission.name,
            isEnabled: !!rules.find(
              (rule) =>
                rule.permissionId === permission.id && rule.menuId === menu.id
            )?.isEnable,
            checked: !!roleAccesses.find(
              (roleAccess) =>
                roleAccess.permissionId === permission.id &&
                roleAccess.menuId === menu.id
            )?.status,
          }))
          .filter((el) => el.isEnabled),
        children: menu.children!.map((child) => ({
          id: child.id!,
          name: child.name,
          permissions: permissions
            .map((permission) => ({
              id: permission.id,
              name: permission.name,
              isEnabled: !!rules.find(
                (rule) =>
                  rule.permissionId === permission.id &&
                  rule.menuId === child.id
              )?.isEnable,
              checked: !!roleAccesses.find(
                (roleAccess) =>
                  roleAccess.permissionId === permission.id &&
                  roleAccess.menuId === child.id
              )?.status,
            }))
            .filter((el) => el.isEnabled),
        })),
      })),
      roleAccesses.map((el) => ({
        ...el,
        id: undefined,
        roleId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      })),
      role.unmarshal(),
    ];
  }

  // ! current implementation does not work on more than 2 level menu parent children
  public async updateRoleAccessesByRoleId(
    roleAccesses: Pick<IRoleAccess, "menuId" | "permissionId" | "status">[],
    roleId: string
  ): Promise<boolean> {
    console.log("MASUK");
    await this._roleRepository.findById(roleId, {});
    const menus = await this._repository.getMenuWithChildren();
    for (const roleAccess of roleAccesses) {
      const parent = menus.find(
        (menu) =>
          !!menu.children!.find((child) => child.id === roleAccess.menuId)
      );
      const isChildMenuActive = roleAccess.status && !!parent;
      const allPermissionId = await this._permissionRepository.findByField([
        { field: "name", value: "ALL" },
      ]);
      const viewPermissionId = await this._permissionRepository.findByField([
        { field: "name", value: "VIEW" },
      ]);

      // activate parent view permission when children is active
      if (isChildMenuActive) {
        roleAccesses.push({
          menuId: parent.id!,
          permissionId: viewPermissionId!.id,
          status: true,
        });
      }

      // activate view permission when other permission is active
      if (
        roleAccess.status &&
        roleAccess.permissionId !== viewPermissionId!.id
      ) {
        roleAccesses.push({
          menuId: roleAccess.menuId,
          permissionId: viewPermissionId!.id,
          status: true,
        });
      }

      // activate all permission when all is active
      if (
        roleAccess.status &&
        roleAccess.permissionId === allPermissionId!.id
      ) {
        // get permission list for this menu
        const menuPermissionRules =
          await this._menuPermissionRuleRepository.getMenuPermissionsByMenuId(
            roleAccess.menuId
          );
        menuPermissionRules.forEach((el) => {
          if (el.permissionId !== allPermissionId!.id) {
            roleAccesses.push({
              menuId: roleAccess.menuId,
              permissionId: el.permissionId,
              status: true,
            });
          }
        });
      }
    }
    await this._roleAccessRepository.bulkUpsert(
      roleAccesses.map((el) => ({ ...el, roleId: roleId }))
    );
    return true;
  }
}
