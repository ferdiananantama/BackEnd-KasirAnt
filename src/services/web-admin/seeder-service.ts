import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { RoleRepository } from "@/domain/service/user-management/role-repository";
import ManagedTransactionService from "@/services/managed-transaction-service";
import { Transaction } from "sequelize";
import { UserRepository } from "@/domain/service/user-management/user-repository";
import { MenuRepository } from "@/domain/service/user-management/menu-repository";
import { MenuPermissionRuleRepository } from "@/domain/service/user-management/menu-permission-rule-repository";
import PermissionRepository from "@/domain/service/user-management/permission-repository";
import { CompanyRepository } from "@/domain/service/app-management/company-repository";

@injectable()
export class SeederService {
  constructor(
    @inject(TYPES.RoleRepository) private _roleRepository: RoleRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: UserRepository,
    @inject(TYPES.CompanyRepository)
    private _companyRepository: CompanyRepository,
    @inject(TYPES.MenuRepository) private _menuRepository: MenuRepository,
    @inject(TYPES.MenuPermissionRuleRepository)
    private _menuPermissionRuleRepository: MenuPermissionRuleRepository,
    @inject(TYPES.PermissionRepository)
    private _permissionRepository: PermissionRepository,
    @inject(TYPES.ManagedTransactionService)
    private _serviceTransaction: ManagedTransactionService
  ) {}

  public async seedUserManagement(): Promise<void> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        await this._menuRepository.seed({ t });
        await this._permissionRepository.seed({ t });
        await this._menuPermissionRuleRepository.seed({ t });

        await this._companyRepository.seedCompany({ t });
        await this._roleRepository.seedAdmin({ t });
        await this._userRepository.seedAdmin({ t });
      },
      "Failed to seed user management"
    );
  }
}
