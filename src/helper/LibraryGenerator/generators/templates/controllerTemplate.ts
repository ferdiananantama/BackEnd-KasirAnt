const controllerTemplate = `
import { HttpCode } from "@/libs/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "@/types";
import { AuthRequest } from "../utils/types/jwt-request";
import { %%entityName%%Service } from "@/services/%%entityFileName%%-service"; // Pastikan path sesuai
import { PaginationQueryWithSearchDto } from "@/dto/pagination-query-dto";

@injectable()
export class %%entityName%%Controller {
    constructor(
        @inject(TYPES.%%entityName%%Service)
        private readonly %%entityName%%Service: %%entityName%%Service
    ) { }

    async getAll%%entityName%%(req: AuthRequest & Request, res: Response): Promise<Response> {
        const query: PaginationQueryWithSearchDto = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            search: (req.query.search as string) || ''
        };
        const data = await this.%%entityName%%Service.findAll(query);
        return StandardResponse.create(res)
            .setResponse({
                message: "%%entityName%% data",
                status: HttpCode.OK,
                data: data.data
            })
            .withPagination(data.pagination)
            .send();
    }

    async create(req: AuthRequest & Request, res: Response): Promise<Response> {
        const data = await this.%%entityName%%Service.create(req.body);
        return StandardResponse.create(res)
            .setResponse({
                message: "%%entityName%% created",
                status: HttpCode.RESOURCE_CREATED,
                data: data.data
            })
            .withPagination(data.pagination)
            .send();
    }

    async update(req: AuthRequest & Request, res: Response): Promise<Response> {
        const data = await this.%%entityName%%Service.update(req.params.id, req.body);
        return StandardResponse.create(res)
            .setResponse({
                message: "%%entityName%% updated",
                status: HttpCode.OK,
                data: data
            })
            .send();
    }

    async delete(req: AuthRequest & Request, res: Response): Promise<Response> {
        await this.%%entityName%%Service.delete(req.params.id);
        return StandardResponse.create(res)
            .setResponse({
                message: "%%entityName%% deleted",
                status: HttpCode.OK,
            })
            .send();
    }
}
`;

module.exports = { controllerTemplate };
