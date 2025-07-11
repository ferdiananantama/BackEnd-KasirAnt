import { Auth, IAuth } from "@/domain/models/auth";
import { UserRepository } from "@/domain/service/user-management/user-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { webadminLoginScheme } from "@/presentation/validation/web-admin/user-validation";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import moment from "moment";

@injectable()
export class WebadminAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: UserRepository
  ) {}

  public async login(
    param: typeof webadminLoginScheme._output
  ): Promise<IAuth> {
    const user = await this._userRepo.findByEmail(param.email);
    if (!user) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User not found",
      });
    }
    if (!user.verifyPassword(param.password)) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Wrong Password",
      });
    }
    const auth = Auth.create({
      user: {
        ...user.unmarshal(),
        password: undefined,
        passwordLastUpdatedAtToString: `Last update ${moment(
          user.passwordLastUpdatedAt
        ).fromNow()}`,
      },
    });
    return auth.unmarshal();
  }

  public async me(token: string): Promise<IAuth> {
    const auth = Auth.createFromToken(token);
    const user = await this._userRepo.findById(auth.user.id, {});
    auth.user = {
      ...user.unmarshal(),
      password: undefined,
      passwordLastUpdatedAtToString: `Last update ${moment(
        user.passwordLastUpdatedAt
      ).fromNow()}`,
    };
    return auth.unmarshal();
  }
}
