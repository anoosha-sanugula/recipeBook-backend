import express from "express";
import { createRecipe } from "../../controllers/recipe/createRecipes";
import { getRecipes } from "../../controllers/recipe/getRecipes";
const recipeRoutes = express();
recipeRoutes.use(express.urlencoded({ extended: true }));
recipeRoutes.use(express.json());

recipeRoutes.post("/recipes", createRecipe);
recipeRoutes.get("/recipes", getRecipes);
export default recipeRoutes;
