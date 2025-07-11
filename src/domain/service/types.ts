import { Transaction } from "sequelize";

export interface DefaultEntityBehaviour<I> {
  unmarshal(): I;
}

export interface TStandardPaginationOption {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: string;
}

export interface BaseQueryOption {
  t: Transaction;
}
