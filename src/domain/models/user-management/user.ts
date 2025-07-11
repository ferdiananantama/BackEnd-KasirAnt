import { Entity, IBaseDomainProperty } from "@/domain/models/entity";
import bcrypt from "bcryptjs";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IRole } from "@/domain/models/user-management/role";
import { Company } from "@/infrastructure/database/models/company-sequelize";

// export enum EUserRole {
//   SUPER_ADMIN = "SUPER_ADMIN",
//   ADMIN = "ADMIN",
//   INSPECTOR = "INSPECTOR",
// }

export interface IUser extends IBaseDomainProperty {
  email: string;
  password?: string | null | undefined;
  passwordLastUpdatedAt?: Date | undefined;
  fullname: string;
  isActive?: boolean | undefined;
  avatarPath?: string | null | undefined;
  roleId: string;
  role?: IRole | null;
  companyId?: string | null;
  company?: Company | null;
  passwordLastUpdatedAtToString?: string | undefined;
}

export class User extends Entity<IUser> {
  private constructor(props: IUser) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IUser): User {
    return new User(props);
  }

  public unmarshal(): IUser {
    return {
      id: this._id,
      email: this.email,
      password: this.password,
      passwordLastUpdatedAt: this.passwordLastUpdatedAt,
      fullname: this.fullname,
      isActive: this.isActive,
      avatarPath: this.avatarPath,
      roleId: this.roleId,
      companyId: this.companyId,
      company: this.company,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      role: this.role,
      passwordLastUpdatedAtToString: this.passwordLastUpdatedAtToString,
    };
  }

  public verifyPassword(password: string): boolean {
    if (this.password) {
      return bcrypt.compareSync(password, this.password);
    }
    return false;
  }

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this.props.email;
  }
  get password(): string | undefined | null {
    return this.props.password;
  }
  set password(val: string | undefined | null) {
    if (val && val !== "") {
      this.props.password = bcrypt.hashSync(val, 10);
    } else {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Password is required",
      });
    }
  }
  get passwordLastUpdatedAt(): Date | undefined {
    return this.props.passwordLastUpdatedAt;
  }
  set passwordLastUpdatedAt(val: Date | undefined) {
    this.props.passwordLastUpdatedAt = val;
  }
  get fullname(): string {
    return this.props.fullname;
  }
  get isActive(): boolean | undefined {
    return this.props.isActive;
  }
  get avatarPath(): string | undefined | null {
    return this.props.avatarPath;
  }
  set avatarPath(val: string | undefined | null) {
    this.props.avatarPath = val;
  }
  get roleId(): string {
    return this.props.roleId;
  }
  get companyId(): string | null | undefined {
    return this.props.companyId;
  }
  get company(): Company | null | undefined {
    return this.props.company;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
  get deletedAt(): Date | undefined | null {
    return this.props.deletedAt;
  }
  get role(): IRole | null | undefined {
    return this.props.role;
  }
  get passwordLastUpdatedAtToString(): string | undefined {
    return this.props.passwordLastUpdatedAtToString;
  }
}
