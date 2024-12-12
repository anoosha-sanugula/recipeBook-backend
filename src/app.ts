import { connectToDatabase, sequelize } from "./database";

const main = async () => {
  try {
    await connectToDatabase();
    await sequelize.sync({ force: false });
    console.log("Database created successfully.");
  } catch (error: any) {
    console.error("Error during synchronization:", error);
  }
};

main();
