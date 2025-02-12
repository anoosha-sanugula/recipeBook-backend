import request from "supertest";
import { sequelize } from "../server";
import { Recipe } from "../models/Recipe";
import { Ingredients } from "../models/Ingredients";
import recipeRoutes from "../routes/recipe/recipe";
import express, { NextFunction } from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/recipebook", recipeRoutes);

jest.mock("../models/Recipe");
jest.mock("../models/Ingredients");
jest.mock("../user/loginUser.controller", () => ({
  authenticateToken: (req: Request, res: Response, next: NextFunction) =>
    next(),
}));

describe("POST /recipes", () => {
  let transactionMock: any;
  let createRecipeData: any;

  beforeEach(() => {
    createRecipeData = {
      title: "Test Recipe",
      description: "Delicious test recipe",
      instructions: "Mix and cook",
      category: "Dessert",
      rating: 4.5,
      imageUrl: "https://example.com/image.jpg",
      videoUrl: "https://example.com/video.mp4",
      cookingTime: 30,
      nutritionFact: "200 calories",
      ingredients: [
        {
          name: "Sugar",
          quantity: 200,
          unit: "g",
          imageUrl: "https://example.com/sugar.jpg",
        },
        {
          name: "Flour",
          quantity: 100,
          unit: "g",
          imageUrl: "https://example.com/flour.jpg",
        },
      ],
    };

    transactionMock = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    sequelize.transaction = jest.fn().mockResolvedValue(transactionMock);
  });

  it("should create a new recipe successfully", async () => {
    (Recipe.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...createRecipeData,
    });

    (Ingredients.create as jest.Mock).mockResolvedValue({
      id: 1,
      recipeId: 1,
      ...createRecipeData.ingredients[0],
    });

    const response = await request(app)
      .post("/recipebook/recipes")
      .send(createRecipeData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Recipe created successfully");
    expect(Recipe.create).toHaveBeenCalledTimes(1);
    expect(Ingredients.create).toHaveBeenCalledTimes(2);
    expect(transactionMock.commit).toHaveBeenCalledTimes(1);
  });

  it("should return 500 if an error occurs during the creation process", async () => {
    (Recipe.create as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/recipebook/recipes")
      .send(createRecipeData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
    expect(transactionMock.rollback).toHaveBeenCalledTimes(1);
  });

  it("should return 404 if transaction fails", async () => {
    sequelize.transaction = jest
      .fn()
      .mockRejectedValue(new Error("Transaction error"));

    const response = await request(app).post("/recipes").send(createRecipeData);

    expect(response.status).toBe(404);
  });
});
