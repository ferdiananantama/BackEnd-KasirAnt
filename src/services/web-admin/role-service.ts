import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { RoleRepository } from "@/domain/service/user-management/role-repository";
import { TStandardPaginationOption } from "@/domain/service/types";
import { Pagination } from "@/domain/models/pagination";
import { IRole } from "@/domain/models/user-management/role";
import { IMenuPermissionPlain } from "@/dto/menu-rule-dto";
import { RoleAccessRepository } from "@/domain/service/user-management/role-access-repository";
import ManagedTransactionService from "@/services/managed-transaction-service";
import { Transaction } from "sequelize";
import { UserRepository } from "@/domain/service/user-management/user-repository";

@injectable()
export class RoleService {
  constructor(
    @inject(TYPES.RoleRepository) private _repository: RoleRepository,
    @inject(TYPES.RoleAccessRepository)
    private _roleAccessRepository: RoleAccessRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: UserRepository,
    @inject(TYPES.ManagedTransactionService)
    private _serviceTransaction: ManagedTransactionService
  ) {}

  public async findAll(
    options?: TStandardPaginationOption
  ): Promise<[IRole[], Pagination?]> {
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

  public async findById(id: string): Promise<IRole> {
    return (await this._repository.findById(id, {})).unmarshal();
  }

  public async seedAdmin(): Promise<void> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        await this._repository.seedAdmin({ t });
        await this._userRepository.seedAdmin({ t });
      },
      "Failed to seed super admin role, super admin role access, and super admin user"
    );
  }

  public async create(props: IRole): Promise<IRole> {
    return (await this._repository.create(props, {})).unmarshal();
  }

  public async update(id: string, props: IRole): Promise<IRole> {
    return (await this._repository.update(id, props, {})).unmarshal();
  }

  public async destroy(id: string): Promise<boolean> {
    return await this._repository.delete(id, {});
  }

  public async assignMenuPermissionToRole(
    menuPermission: IMenuPermissionPlain,
    roleId: string,
    status: boolean
  ): Promise<boolean> {
    await this._roleAccessRepository.create({
      ...menuPermission,
      roleId,
      status,
    });
    return true;
  }
}
