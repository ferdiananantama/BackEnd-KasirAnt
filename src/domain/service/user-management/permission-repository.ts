import BaseRepository from "@/domain/service/base-repository";
import {
  IPermission,
  Permission,
} from "@/domain/models/user-management/permission";
import { BaseQueryOption } from "@/domain/service/types";

export default interface PermissionRepository
  extends BaseRepository<Permission, IPermission> {
  seed(option: Partial<BaseQueryOption>): Promise<void>;
  findByField(
    param: { field: string; value: string | number }[]
  ): Promise<Permission | undefined>;
}
