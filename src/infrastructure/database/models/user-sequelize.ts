import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "@/infrastructure/database/sequelize";
import { IUser } from "@/domain/models/user-management/user";
import { Role } from "@/infrastructure/database/models";
import { Company } from "./company-sequelize";

export class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements IUser
{
  declare id: CreationOptional<string>;
  declare email: string;
  declare password: CreationOptional<string> | null;
  declare passwordLastUpdatedAt: CreationOptional<Date>;
  declare companyId?: CreationOptional<string> | null | undefined;
  declare company?: CreationOptional<Company> | null;
  declare fullname: string;
  declare isActive: CreationOptional<boolean>;
  declare avatarPath: CreationOptional<string> | null;
  declare roleId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;
  declare role?: NonAttribute<Role> | null;
  declare static associations: {
    role: Association<User, Role>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    passwordLastUpdatedAt: DataTypes.DATE,
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    avatarPath: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    companyId: {
      type: DataTypes.UUID,
      references: {
        model: Company,
      },
      allowNull: true,
    },
    roleId: {
      type: DataTypes.UUID,
      references: {
        model: Role,
      },
      allowNull: false,
      onDelete: "SET NULL",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    modelName: "user",
    underscored: true,
    paranoid: true,
  }
);
