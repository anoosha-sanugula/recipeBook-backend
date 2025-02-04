import express from "express";
import { createRecipe } from "../../recipe/createRecipes.controller";
import { getRecipes } from "../../recipe/getRecipes.controller";
import { getRecipeById } from "../../recipe/getRecipeById.controller";
import { authenticateToken } from "../../user/loginUser.controller";
const recipeRoutes = express();
recipeRoutes.use(express.urlencoded({ extended: true }));
recipeRoutes.use(express.json());

recipeRoutes.post("/recipes", authenticateToken, createRecipe);
recipeRoutes.get("/recipes", authenticateToken, getRecipes);
recipeRoutes.get("/recipes/:recipeId", authenticateToken, getRecipeById);
export default recipeRoutes;
