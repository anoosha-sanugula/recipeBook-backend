import request from "supertest";
import { Recipe } from "../models/Recipe";
import recipeRoutes from "../routes/recipe/recipe";
import express from "express";
import { NextFunction, Request, Response } from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/recipebook", recipeRoutes);

jest.mock("../models/Recipe", () => ({
  Recipe: {
    findAll: jest.fn(),
  },
}));
jest.mock("../user/loginUser.controller", () => ({
  authenticateToken: (req: Request, res: Response, next: NextFunction) =>
    next(),
}));

describe("GET /recipes", () => {
  it("should fetch all recipes and their ingredients successfully", async () => {
    const mockRecipes = [
      {
        id: 1,
        title: "Pancakes",
        description: "Fluffy pancakes",
        instructions: "Mix ingredients and cook",
        category: "Breakfast",
        rating: 5,
        imageUrl: "https://example.com/pancakes.jpg",
        videoUrl: "https://example.com/pancakes.mp4",
        cookingTime: 15,
        nutritionFact: "High in protein",
        Ingredients: [
          {
            id: 1,
            name: "Flour",
            quantity: 200,
            unit: "grams",
            imageUrl: "https://example.com/flour.jpg",
          },
          {
            id: 2,
            name: "Eggs",
            quantity: 2,
            unit: "pieces",
            imageUrl: "https://example.com/eggs.jpg",
          },
        ],
      },
      {
        id: 2,
        title: "Omelette",
        description: "Delicious omelette",
        instructions: "Whisk eggs and cook",
        category: "Breakfast",
        rating: 4,
        imageUrl: "https://example.com/omelette.jpg",
        videoUrl: "https://example.com/omelette.mp4",
        cookingTime: 10,
        nutritionFact: "Rich in protein",
        Ingredients: [
          {
            id: 3,
            name: "Eggs",
            quantity: 3,
            unit: "pieces",
            imageUrl: "https://example.com/eggs.jpg",
          },
        ],
      },
    ];

    (Recipe.findAll as jest.Mock).mockResolvedValue(mockRecipes);
    const response = await request(app).get("/recipebook/recipes");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe("Pancakes");
    expect(response.body[1].title).toBe("Omelette");
    expect(response.body[0].Ingredients).toHaveLength(2);
    expect(response.body[1].Ingredients).toHaveLength(1);
  });
  it("should return an empty array if no recipes are found", async () => {
    (Recipe.findAll as jest.Mock).mockResolvedValue([]);
    const response = await request(app).get("/recipebook/recipes");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("should return a 500 error if something goes wrong", async () => {
    (Recipe.findAll as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );
    const response = await request(app).get("/recipebook/recipes");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });
});
