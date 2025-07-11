// import { DB_CONFIG } from "@/libs/utils";
// import { Dialect, Sequelize } from "sequelize";

// const { db_name, db_user, db_password, db_host } = DB_CONFIG;
// const sequelize = new Sequelize(db_name, db_user, db_password, {
//   host: db_host,
//   dialect: DB_CONFIG.config.dialect as Dialect,
//   port: parseInt(DB_CONFIG.config.port),
//   logging: false,
// });

// export { Sequelize, sequelize };

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export { Sequelize };
