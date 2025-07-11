import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "@/infrastructure/database/sequelize";
import { Category } from "./category-sequelize";

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<string>;
  declare categoryId: CreationOptional<string> | null;
  declare category?: NonAttribute<Category> | null;
  declare name: string;
  declare imagePath: CreationOptional<string> | null;
  declare price_buy: number;
  declare price_sell: number;
  declare stock: number;
  declare unit: string;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: Category,
      },
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    price_buy: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price_sell: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "products",
    modelName: "products",
    timestamps: true,
    paranoid: true,
  }
);
