const serviceTemplate = `
import { %%entityName%%Repository } from "@/domain/service/%%entityFileName%%-repository";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";

@injectable()
export class %%entityName%%Service {
    constructor(
        @inject(TYPES.%%entityName%%Repository)
        private readonly %%repoEntityName%%Repository: %%entityName%%Repository
    ) { }

    async findAll(isFilter1: any): Promise<any> {
        const items = await this.%%repoEntityName%%Repository.findAll(isFilter1);
        return {
            data: items.data.map((item: any) => item.unmarshal()),
            pagination: items.pagination,
        };
    }

    async create(isData1: any): Promise<any> {
        return (await this.%%repoEntityName%%Repository.create(isData1)).unmarshal();
    }

    async update(isId1: any, isData1: any): Promise<any> {
        const result = await this.%%repoEntityName%%Repository.update(isId1, isData1);
        return result ? result.unmarshal() : null;
    }

    async delete(isId1: any): Promise<any> {
        return this.%%repoEntityName%%Repository.delete(isId1);
    }
}
`;

module.exports = { serviceTemplate };
