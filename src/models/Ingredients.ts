import { DataTypes } from "sequelize";
import { Recipe } from "./Recipe";
import { sequelize } from "../server";

export const Ingredients = sequelize.define(
  "Ingredients",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit: {
      type: DataTypes.ENUM,
      values: [
        "grams",
        "kilograms",
        "milliliters",
        "liters",
        "cups",
        "tablespoons",
        "teaspoons",
        "pinch",
        "units",
      ],
      allowNull: false,
    },
    recipeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Recipe,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
