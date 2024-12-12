import { sequelize } from "./server";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user/user";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export const main = async () => {
  try {
    const PORT = process.env.PORT || 3002;
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");

    app.use("/recipebook", userRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    throw new Error(`Unable to connect to the database: ${error.message}`);
  }
};

main();
