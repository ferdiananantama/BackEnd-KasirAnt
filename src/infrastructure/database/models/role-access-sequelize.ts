import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IRoleAccess } from "@/domain/models/user-management/role-access";
import { sequelize } from "@/infrastructure/database/sequelize";
import { Menu, Permission, Role } from "@/infrastructure/database/models";

export class RoleAccess
  extends Model<
    InferAttributes<RoleAccess>,
    InferCreationAttributes<RoleAccess>
  >
  implements IRoleAccess
{
  declare id: CreationOptional<string>;
  declare menuId: string;
  declare permissionId: string;
  declare roleId: string;
  declare status: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RoleAccess.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    menuId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Menu,
      },
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Permission,
      },
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Role,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "role_access",
    modelName: "roleAccess",
    underscored: true,
  }
);
