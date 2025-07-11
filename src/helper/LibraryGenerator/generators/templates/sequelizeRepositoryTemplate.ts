const sequelizeRepositoryTemplate = `
import { I%%entityName%% } from "@/domain/models/%%entityFileName%%";
import { Pagination } from "@/domain/models/pagination";
import { %%entityName%%Repository } from "@/domain/service/%%entityFileName%%-repository";
import { PaginationQueryWithSearchDto } from "@/dto/pagination-query-dto";
import { injectable } from "inversify";
import { %%entityName%% } from "@/domain/models/%%entityFileName%%";
import { %%entityName%% as %%entityName%%Model } from "@/infrastructure/database/models/%%entityFileName%%-sequelize";
// import { Op } from "sequelize";

@injectable()
export class %%entityName%%SequelizeRepository implements %%entityName%%Repository {
    async findAll(query: PaginationQueryWithSearchDto): Promise<{ pagination: Pagination; data: %%entityName%%[] }> {
        const { page, limit, search } = query;
        console.log(search);
        const pagination = Pagination.create({ page, limit });
        const totalRows = await %%entityName%%Model.count();

        const { rows } = await %%entityName%%Model.findAndCountAll({
            limit,
            offset: pagination.offset,
            // where: {
            //     [Op.or]: [
            //         //{ title: { [Op.like]: \`%\${search}%\` } },
            //         // Tambahkan filter lain sesuai kebutuhan
            //     ],
            // },
        });
        pagination.generateMeta(totalRows, rows.length);
        const data = rows.map(item => %%entityName%%.create(item.toJSON()));
        return {
            data,
            pagination
        };
    }

    async create(data: I%%entityName%%): Promise<%%entityName%%> {
        const createdEntity = await %%entityName%%Model.create(data);
        return %%entityName%%.create(createdEntity.toJSON());
    }

    async update(id: string, data: I%%entityName%%): Promise<%%entityName%% | null> {
        const [updated] = await %%entityName%%Model.update(data, { where: { id } });
        if (updated) {
            return %%entityName%%.create(data);
        }
        return null;
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await %%entityName%%Model.destroy({ where: { id } });
        return !!deleted;
    }
}
`;

module.exports = { sequelizeRepositoryTemplate };
