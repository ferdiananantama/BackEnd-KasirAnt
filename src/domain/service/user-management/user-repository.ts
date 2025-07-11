import BaseRepository from "@/domain/service/base-repository";
import { IUser, User } from "@/domain/models/user-management/user";
import { BaseQueryOption } from "@/domain/service/types";

export interface UserRepository extends BaseRepository<User, IUser> {
  findByEmail(email: string): Promise<User | null>;
  seedAdmin(option: Partial<BaseQueryOption>): Promise<void>;
}
