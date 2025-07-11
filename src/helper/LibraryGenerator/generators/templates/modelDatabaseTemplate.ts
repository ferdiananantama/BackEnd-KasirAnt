const modelDatabaseTemplate = `
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";

export class %%entityName%% extends Model<
    InferAttributes<%%entityName%%>,
    InferCreationAttributes<%%entityName%%>
> {
    declare id: CreationOptional<string>;
    declare createdAt?: CreationOptional<Date>;
    declare updatedAt?: CreationOptional<Date>;
    declare deletedAt?: CreationOptional<Date>;
}

%%entityName%%.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // Tambahkan kolom lain sesuai kebutuhan
    },
    {
        tableName: "%%entityName%%",
        underscored: true,
        timestamps: true,
        paranoid: true,
        sequelize,
    }
);
`;

module.exports = { modelDatabaseTemplate };
