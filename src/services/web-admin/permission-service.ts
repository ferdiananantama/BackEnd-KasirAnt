import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import PermissionRepository from "@/domain/service/user-management/permission-repository";
import { IPermission } from "@/domain/models/user-management/permission";
import { TStandardPaginationOption } from "@/domain/service/types";
import { Pagination } from "@/domain/models/pagination";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { SocketIo } from "@/presentation/socket";
import { Transaction } from "sequelize";
import { container } from "@/container";

@injectable()
export class PermissionService {
  constructor(
    @inject(TYPES.PermissionRepository)
    private _repository: PermissionRepository
  ) {}

  public async findAll(
    options?: TStandardPaginationOption
  ): Promise<[IPermission[], Pagination?]> {
    const socketInstance = container.get<SocketIo>(TYPES.SocketIo);
    socketInstance
      .getInstance()
      .emit("permissions", "someone hit findAll in permission service");
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

  public async findById(id: string, t?: Transaction): Promise<IPermission> {
    return (await this._repository.findById(id, t ? { t } : {})).unmarshal();
  }

  public async create(
    props: IPermission,
    t?: Transaction
  ): Promise<IPermission> {
    const isFound = await this._repository.findByField([
      { field: "name", value: props.name },
    ]);
    if (isFound) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Duplicated Data",
      });
    }
    return (await this._repository.create(props, t ? { t } : {})).unmarshal();
  }

  public async update(
    id: string,
    props: IPermission,
    t?: Transaction
  ): Promise<IPermission> {
    const isFound = await this._repository.findByField([
      { field: "name", value: props.name },
    ]);
    const old = await this._repository.findById(id, t ? { t } : {});
    if (isFound && old.name !== props.name) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Duplicated Data",
      });
    }
    return (
      await this._repository.update(id, props, t ? { t } : {})
    ).unmarshal();
  }

  public async destroy(id: string, t?: Transaction): Promise<boolean> {
    return await this._repository.delete(id, t ? { t } : {});
  }
}
