import { Request, Response } from "express";
import { Recipe } from "../models/Recipe";
import { Ingredients } from "../models/Ingredients";

export const getRecipeById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findOne({
      where: {
        id: recipeId,
      },
      include: {
        model: Ingredients,
        attributes: ["name", "quantity", "unit", "imageUrl"],
        required: false,
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
