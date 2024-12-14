import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../server";

interface RecipeAttributes {
  id: number;
  title: string;
  description?: string;
  instructions?: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Dessert";
  rating?: number;
  imageUrl?: string;
  videoUrl?: string;
  cookingTime?: number;
  nutritionFact?: string;
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, "id"> {}
export class Recipe
  extends Model<RecipeAttributes, RecipeCreationAttributes>
  implements RecipeAttributes
{
  public id!: number;
  public title!: string;
  public description?: string;
  public instructions?: string;
  public category!: "Breakfast" | "Lunch" | "Dinner" | "Dessert";
  public rating?: number;
  public imageUrl?: string;
  public videoUrl?: string;
  public cookingTime?: number;
  public nutritionFact?: string;
}

Recipe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM("Breakfast", "Lunch", "Dinner", "Dessert"),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cookingTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Cooking time in minutes",
    },
    nutritionFact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Recipes",
    timestamps: false,
  }
);
