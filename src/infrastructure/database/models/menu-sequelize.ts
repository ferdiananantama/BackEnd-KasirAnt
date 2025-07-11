import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { IMenu } from "@/domain/models/user-management/menu";
import { sequelize } from "@/infrastructure/database/sequelize";

export class Menu
  extends Model<
    InferAttributes<Menu, { omit: "children" }>,
    InferCreationAttributes<
      Menu,
      {
        omit: "children";
      }
    >
  >
  implements IMenu
{
  declare id: CreationOptional<string>;
  declare name: string;
  declare order: number;
  declare parentId: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;
  declare children?: NonAttribute<Menu[]>;
  declare static associations: {
    children: Association<Menu, Menu>;
  };
}

Menu.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      references: {
        model: Menu,
      },
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
    tableName: "menus",
    modelName: "menu",
    underscored: true,
    paranoid: true,
  }
);
