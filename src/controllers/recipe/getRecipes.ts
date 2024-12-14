import { Request, Response } from "express";
import { Recipe } from "../../models/Recipe";
import { Ingredients } from "../../models/Ingredients";

export const getRecipes = async (req: Request, res: Response): Promise<any> => {
  try {
    const recipes = await Recipe.findAll({
      include: {
        model: Ingredients,
        attributes: ["name", "quantity", "unit", "imageUrl"],
        required: false,
      },
    });

    return res.status(200).json(recipes);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
