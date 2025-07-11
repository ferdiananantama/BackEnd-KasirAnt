import BaseRepository from "@/domain/service/base-repository";
import { IRole, Role } from "@/domain/models/user-management/role";
import { BaseQueryOption } from "@/domain/service/types";

export interface RoleRepository extends BaseRepository<Role, IRole> {
  seedAdmin(option: Partial<BaseQueryOption>): Promise<void>;
}
