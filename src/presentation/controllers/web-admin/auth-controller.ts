import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { AuthRequest } from "@/presentation/utils/types/jwt-request";
import { webadminLoginScheme } from "@/presentation/validation/web-admin/user-validation";
import { WebadminAuthService } from "@/services/web-admin/auth-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WebadminAuthController {
  constructor(
    @inject(TYPES.WebadminAuthService) private _authService: WebadminAuthService
  ) {}

  public async login(req: Request, res: Response): Promise<Response> {
    const validatedReq = webadminLoginScheme.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const auth = await this._authService.login(validatedReq.data);
    return res.json({
      message: "success",
      data: auth,
    });
  }

  public async me(req: AuthRequest, res: Response): Promise<Response> {
    const auth = await this._authService.me(
      <string>req.get("Authorization")?.split(" ")[1]
    );
    return res.json({
      message: "success",
      data: auth,
    });
  }
}
