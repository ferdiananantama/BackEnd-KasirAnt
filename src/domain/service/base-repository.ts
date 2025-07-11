import {
  BaseQueryOption,
  TStandardPaginationOption,
} from "@/domain/service/types";
import { Pagination } from "@/domain/models/pagination";

export default interface BaseRepository<T, I> {
  findAllWithPagination(
    option: TStandardPaginationOption,
    pagination: Pagination,
    queryOption: Partial<BaseQueryOption>
  ): Promise<[T[], Pagination]>;

  findAll(option: Partial<BaseQueryOption>): Promise<T[]>;

  findById(id: string, option: Partial<BaseQueryOption>): Promise<T>;

  create(props: I, option: Partial<BaseQueryOption>): Promise<T>;

  update(id: string, props: I, option: Partial<BaseQueryOption>): Promise<T>;

  delete(id: string, option: Partial<BaseQueryOption>): Promise<boolean>;
}
