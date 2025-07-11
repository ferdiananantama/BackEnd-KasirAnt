import { DB_CONFIG } from "@/libs/utils";
import { Dialect, Sequelize } from "sequelize";

const { db_name, db_user, db_password, db_host } = DB_CONFIG;
const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  dialect: DB_CONFIG.config.dialect as Dialect,
  port: parseInt(DB_CONFIG.config.port),
  logging: false,
});

export { Sequelize, sequelize };
