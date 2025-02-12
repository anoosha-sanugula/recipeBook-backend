import { Request, Response } from "express";
import { Ingredients } from "../models/Ingredients";
import { sequelize } from "../server";
import { Recipe } from "../models/Recipe";

export const createRecipe = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    title,
    description,
    instructions,
    category,
    rating,
    imageUrl,
    videoUrl,
    cookingTime,
    nutritionFact,
    ingredients,
  } = req.body;

  if (!title || !category)
    return res.status(400).json({ message: "Please fill the required fields" });

  const transaction = await sequelize.transaction();

  try {
    const recipe = await Recipe.create(
      {
        title,
        description,
        instructions,
        category,
        rating,
        imageUrl,
        videoUrl,
        cookingTime,
        nutritionFact,
      },
      { transaction }
    );

    const ingredient = ingredients.map(async (ingredient: any) => {
      try {
        if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
          return res.status(400).json({
            message: `Invalid ingredient data`,
          });
        }

        await Ingredients.create(
          {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            imageUrl: ingredient.imageUrl,
            recipeId: recipe.id,
          },
          { transaction }
        );
      } catch (ingredientError) {
        return res.status(401).json({
          error: `Error while creating ingredient data:${ingredientError}`,
        });
      }
    });

    await Promise.all(ingredient);
    await transaction.commit();

    return res
      .status(201)
      .json({ message: "Recipe created successfully", data: recipe });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
