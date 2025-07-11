import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IRole } from "@/domain/models/user-management/role";
import { sequelize } from "@/infrastructure/database/sequelize";

export class Role
  extends Model<InferAttributes<Role>, InferCreationAttributes<Role>>
  implements IRole
{
  declare id: CreationOptional<string>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;
}

Role.init(
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
    tableName: "roles",
    modelName: "role",
    underscored: true,
    paranoid: true,
  }
);
