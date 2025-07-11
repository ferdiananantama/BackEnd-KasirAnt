const serviceDomainTemplate = `
import { I%%entityName%%, %%entityName%% } from "@/domain/models/%%entityFileName%%";
import { Pagination } from "@/domain/models/pagination";
import { PaginationQueryWithSearchDto } from "@/dto/pagination-query-dto";

export interface %%entityName%%Repository {
    findAll(query: PaginationQueryWithSearchDto): Promise<{ pagination: Pagination; data: %%entityName%%[] }>;
    create(data: I%%entityName%%): Promise<%%entityName%%>;
    update(id: string, data: I%%entityName%%): Promise<%%entityName%% | null>;
    delete(id: string): Promise<boolean>;
}
`;

module.exports = { serviceDomainTemplate: serviceDomainTemplate };
