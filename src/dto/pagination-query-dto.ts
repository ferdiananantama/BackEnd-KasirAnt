export interface PaginationQueryDto {
    page: number;
    limit: number;
}

export interface PaginationQueryWithSearchDto extends PaginationQueryDto {
    search?: string;
    filter?: string;
    date?: string;
}

export interface PaginationQueryWithFilterDateDto extends PaginationQueryDto {
    filterDate?: string;
}

export interface PaginationQueryWithFilterDateAndSearchDto
    extends PaginationQueryDto {
    filterDate?: string;
    search?: string;
}
