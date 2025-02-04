import { Recipe } from "./Recipe";
import { Ingredients } from "./Ingredients";

export const setupAssociations = () => {
  Recipe.hasMany(Ingredients, { foreignKey: "recipeId" });
  Ingredients.belongsTo(Recipe, { foreignKey: "recipeId" });
};
