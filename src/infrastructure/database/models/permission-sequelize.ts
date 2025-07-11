import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IPermission } from "@/domain/models/user-management/permission";
import { TPermissionList } from "@/const";
import { sequelize } from "@/infrastructure/database/sequelize";

export class Permission
  extends Model<
    InferAttributes<Permission>,
    InferCreationAttributes<Permission>
  >
  implements IPermission
{
  declare id: CreationOptional<string>;
  declare name: TPermissionList;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: "permissions",
    modelName: "permission",
    underscored: true,
    paranoid: true,
  }
);
