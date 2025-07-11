import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "@/infrastructure/database/sequelize";

export class Company extends Model<
  InferAttributes<Company>,
  InferCreationAttributes<Company>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare logoPath: string;
  declare address: string;
}

Company.init(
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
    logoPath: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "companies",
    modelName: "companies",
    timestamps: true,
    paranoid: true,
  }
);
