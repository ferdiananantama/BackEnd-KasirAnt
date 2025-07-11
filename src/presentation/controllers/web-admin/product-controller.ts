import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { queryOptionValidation } from "@/presentation/validation/query-option-validation";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";
import {
  ProductCreateScheme,
  ProductUpdateScheme,
} from "@/presentation/validation/web-admin/product-validation";
import { FileSystem } from "@/infrastructure/file-system";
import { ProductSevice } from "@/services/web-admin/product-service";

@injectable()
export default class ProductController {
  constructor(
    @inject(TYPES.ProductService)
    private _productService: ProductSevice
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
    const [products, pagination] = await this._productService.findAll(
      validatedPagination.data
    );

    return StandardResponse.create(res)
      .setResponse({
        message: "Products fetched",
        data: products,
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
    const product = await this._productService.findById(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: "Product detail fetched",
        data: product,
        status: HttpCode.OK,
      })
      .send();
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const files = req.file as Express.Multer.File;
    const validatedReq = ProductCreateScheme.safeParse({
      ...req.body,
      imagePath: files,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const created = await this._productService.store(
      {
        ...validatedReq.data,
        imagePath: validatedReq.data.imagePath
          ? FileSystem.store(validatedReq.data.imagePath, "products")
          : undefined,
      },
      validatedReq.data.categoryId as string
    );

    return StandardResponse.create(res)
      .setResponse({
        message: "Product created",
        data: created,
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const files = req.file as Express.Multer.File;
    const validatedReq = ProductUpdateScheme.safeParse({
      ...req.params,
      ...req.body,
      imagePath: files,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const updated = await this._productService.update(
      validatedReq.data.id as string,
      {
        ...validatedReq.data,
        imagePath: validatedReq.data.imagePath
          ? FileSystem.store(validatedReq.data.imagePath, "products")
          : undefined,
      }
    );

    return StandardResponse.create(res)
      .setResponse({
        message: "Product updated",
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

    await this._productService.destroy(validatedReq.data.id);

    return StandardResponse.create(res)
      .setResponse({
        message: "Product deleted",
        status: HttpCode.NO_CONTENT,
      })
      .send();
  }
}
