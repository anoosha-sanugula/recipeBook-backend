import { Sequelize } from "sequelize";
import 'dotenv/config';

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export { sequelize };
