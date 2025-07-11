import { Auth } from "@/domain/models/auth";
import { TYPES } from "@/types";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AuthRequest } from "@/presentation/utils/types/jwt-request";
import { WebadminAuthService } from "@/services/web-admin/auth-service";

@injectable()
export class MobileAuthMiddleware {
  constructor(
    @inject(TYPES.WebadminAuthService) private _authService: WebadminAuthService
  ) {}
  public async handle(req: Request, _: Response, next: NextFunction) {
    const user = await this._authService.me(
      <string>req.get("Authorization")?.split(" ")?.[1] || ""
    );
    const newReq: AuthRequest = <AuthRequest>req;
    newReq.auth = Auth.create(user);
    next();
  }
}
