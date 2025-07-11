import { DefaultEntityBehaviour } from "@/domain/service/types";

export interface IPagination {
  page: number;
  limit: number;
  offset: number;
  totalRows: number;
  currentRowsCount: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
}

export class Pagination
  implements IPagination, DefaultEntityBehaviour<IPagination>
{
  page: number;
  limit: number;
  offset: number;
  totalRows: number;
  currentRowsCount: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;

  private constructor(props: IPagination) {
    this.currentRowsCount = props.currentRowsCount;
    this.limit = props.limit;
    this.nextPage = props.nextPage;
    this.offset = props.offset;
    this.page = props.page;
    this.prevPage = props.prevPage;
    this.totalPages = props.totalPages;
    this.totalRows = props.totalRows;
  }

  public static emptyState(): Pagination {
    return new Pagination({
      currentRowsCount: 0,
      limit: 10,
      nextPage: null,
      prevPage: null,
      offset: 0,
      page: 1,
      totalPages: 0,
      totalRows: 0,
    });
  }

  public static create({ page, limit }: { page: number; limit: number }) {
    return new Pagination({
      currentRowsCount: 0,
      limit: limit,
      nextPage: null,
      prevPage: null,
      offset: (page - 1) * limit,
      page: page,
      totalPages: 0,
      totalRows: 0,
    });
  }

  generateMeta(totalRow: number, fetchedLength: number): Pagination {
    this.totalRows = totalRow;
    this.currentRowsCount = this.offset + fetchedLength;
    this.totalPages = Math.ceil(this.totalRows / this.limit);
    this.prevPage = this.page === 1 ? null : this.page - 1;
    this.nextPage =
      this.page === this.totalPages
        ? null
        : this.totalPages > 1
        ? this.page + 1
        : null;
    return this;
  }

  omitProperties<key extends keyof IPagination>(
    key: keyof IPagination
  ): Omit<IPagination, key> {
    const data = this.unmarshal();
    delete data[key];
    return data;
  }

  unmarshal(): IPagination {
    return {
      page: this.page,
      limit: this.limit,
      offset: this.offset,
      totalRows: this.totalRows,
      currentRowsCount: this.currentRowsCount,
      nextPage: this.nextPage,
      prevPage: this.prevPage,
      totalPages: this.totalPages,
    };
  }
}
