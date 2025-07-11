import { IUser, User } from "@/domain/models/user-management/user";
import { UserRepository } from "@/domain/service/user-management/user-repository";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { FileSystem } from "@/infrastructure/file-system";
import { Transaction } from "sequelize";
import { TStandardPaginationOption } from "@/domain/service/types";
import { Pagination } from "@/domain/models/pagination";
import { RoleRepository } from "@/domain/service/user-management/role-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import ManagedTransactionService from "@/services/managed-transaction-service";
import moment from "moment";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private _repository: UserRepository,
    @inject(TYPES.RoleRepository) private _roleRepository: RoleRepository,
    @inject(TYPES.ManagedTransactionService)
    private _serviceTransaction: ManagedTransactionService
  ) {}

  public async findAll(
    param: TStandardPaginationOption
  ): Promise<[IUser[], Pagination?]> {
    let pagination: Pagination | undefined = undefined;
    if (param.limit && param.page) {
      pagination = Pagination.create({
        page: param.page,
        limit: param.limit,
      });
      const [data, paginationResult] =
        await this._repository.findAllWithPagination(param, pagination, {});
      return [
        data.map((el) => ({ ...el.unmarshal(), password: undefined })),
        paginationResult,
      ];
    }
    const users = await this._repository.findAll({});
    return [
      users.map((user) => ({ ...user.unmarshal(), password: undefined })),
    ];
  }

  public async findById(id: string, t?: Transaction): Promise<IUser> {
    let option: {} | { t: Transaction } = {};
    if (t) {
      option = { t };
    }
    const user = await this._repository.findById(id, option);
    return {
      ...user.unmarshal(),
      password: undefined,
      passwordLastUpdatedAtToString: `Last update ${moment(
        user.passwordLastUpdatedAt
      ).fromNow()}`,
    };
  }

  public async store(_user: IUser, t?: Transaction): Promise<IUser> {
    await this._roleRepository.findById(_user.roleId, t ? { t } : {});
    const isEmailUsed = await this._repository.findByEmail(_user.email);
    if (isEmailUsed) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Email already used",
      });
    }

    const userData = User.create({
      ..._user,
      password: undefined,
      passwordLastUpdatedAt: new Date(),
    });
    userData.password = _user.password;
    const user = await this._repository.create(
      userData.unmarshal(),
      t ? { t } : {}
    );
    return {
      ...user.unmarshal(),
      password: undefined,
    };
  }

  public async update(
    id: string,
    _user: IUser,
    t?: Transaction
  ): Promise<IUser> {
    await this._roleRepository.findById(_user.roleId, t ? { t } : {});
    const isEmailUsed = await this._repository.findByEmail(_user.email);
    if (isEmailUsed && isEmailUsed.id !== id) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Email already used",
      });
    }

    const oldUserData = await this._repository.findById(id, t ? { t } : {});
    const userProps = User.create({
      ..._user,
      id: id,
      password: undefined,
    });
    if (_user.password) {
      userProps.password = _user.password;
      userProps.passwordLastUpdatedAt = new Date();
    }
    if (_user.avatarPath && oldUserData?.avatarPath)
      FileSystem.destroy(oldUserData.avatarPath);

    const user = await this._repository.update(
      id,
      userProps.unmarshal(),
      t ? { t } : {}
    );
    return {
      ...user.unmarshal(),
      password: undefined,
    };
  }

  public async destroy(id: string): Promise<boolean> {
    return await this._serviceTransaction.runOnSingleTransaction(
      async (t: Transaction) => {
        const userData = await this._repository.findById(id, t ? { t } : {});
        if (userData.avatarPath) {
          FileSystem.destroy(userData.avatarPath);
        }
        await this._repository.delete(id, t ? { t } : {});
        return true;
      },
      "Failed to destroy user"
    );
  }
}
