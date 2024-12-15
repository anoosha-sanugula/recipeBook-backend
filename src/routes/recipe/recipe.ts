import express from "express";
import { createRecipe } from "../../controllers/recipe/createRecipes";
import { getRecipes } from "../../controllers/recipe/getRecipes";
import { getRecipeById } from "../../controllers/recipe/getRecipeById";
const recipeRoutes = express();
recipeRoutes.use(express.urlencoded({ extended: true }));
recipeRoutes.use(express.json());

recipeRoutes.post("/recipes", createRecipe);
recipeRoutes.get("/recipes", getRecipes);
recipeRoutes.get("/recipes/:recipeId", getRecipeById);
export default recipeRoutes;
