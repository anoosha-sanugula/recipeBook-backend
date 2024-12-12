import { sequelize } from "./server";

export const main = async () => {
  try {
    await sequelize.sync({ force: false });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error: any) {
    throw new Error(`Unable to connect to the database: ${error.message}`);
  }
};

main();
