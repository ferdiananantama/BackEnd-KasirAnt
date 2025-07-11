import { ICategory } from "@/domain/models/app-management/category";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "@/infrastructure/database/sequelize";

export class Category
  extends Model<InferAttributes<Category>, InferCreationAttributes<Category>>
  implements ICategory
{
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: CreationOptional<string>;
}

Category.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "categories",
    timestamps: true,
    paranoid: true,
  }
);
