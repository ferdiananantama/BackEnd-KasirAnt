import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { queryOptionValidation } from "@/presentation/validation/query-option-validation";
import { CategoryCreateScheme } from "@/presentation/validation/web-admin/category-validation";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";
import { CategoryService } from "@/services/web-admin/category-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export default class CategoryController {
  constructor(
    @inject(TYPES.CategoryService) private _categoryService: CategoryService
  ) {}

  public async getAll(req: Request, res: Response): Promise<Response> {
    const validatedPagination = queryOptionValidation.safeParse(req.query);
    if (!validatedPagination.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedPagination.error.flatten().fieldErrors,
      });
    }
    const [categories, pagination] = await this._categoryService.findAll(
      validatedPagination.data
    );

    return StandardResponse.create(res)
      .setResponse({
        message: "Categories fetched",
        data: categories,
        status: HttpCode.OK,
      })
      .withPagination(pagination)
      .send();
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    const validatedReq = soleUuidValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const category = await this._categoryService.findById(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: "Category detail fetched",
        data: category,
        status: HttpCode.OK,
      })
      .send();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const validatedReq = CategoryCreateScheme.safeParse({ ...req.body });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const created = await this._categoryService.store({
      ...validatedReq.data,
    });

    return StandardResponse.create(res)
      .setResponse({
        message: "Category created",
        data: created,
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const validatedReq = soleUuidValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const validatedBody = CategoryCreateScheme.safeParse({ ...req.body });
    if (!validatedBody.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedBody.error.flatten().fieldErrors,
      });
    }

    const updated = await this._categoryService.update(
      validatedReq.data.id,
      validatedBody.data
    );

    return StandardResponse.create(res)
      .setResponse({
        message: "Category updated",
        data: updated,
        status: HttpCode.OK,
      })
      .send();
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    const validatedReq = soleUuidValidation.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    await this._categoryService.destroy(validatedReq.data.id);

    return StandardResponse.create(res)
      .setResponse({
        message: "Category deleted",
        status: HttpCode.NO_CONTENT,
      })
      .send();
  }
}
