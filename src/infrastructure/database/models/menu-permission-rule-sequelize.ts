import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IMenuPermissionRule } from "@/domain/models/user-management/menu-permission-rule";
import { sequelize } from "@/infrastructure/database/sequelize";
import { Menu } from "@/infrastructure/database/models/menu-sequelize";
import { Permission } from "@/infrastructure/database/models/permission-sequelize";

export class MenuPermissionRule
  extends Model<
    InferAttributes<MenuPermissionRule>,
    InferCreationAttributes<MenuPermissionRule>
  >
  implements IMenuPermissionRule
{
  declare id: CreationOptional<string>;
  declare menuId: string;
  declare permissionId: string;
  declare isEnable: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MenuPermissionRule.init(
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
    isEnable: {
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
    tableName: "menu_permission_rules",
    modelName: "menuPermissionRule",
    underscored: true,
  }
);
