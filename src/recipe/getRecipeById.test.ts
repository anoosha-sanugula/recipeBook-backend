import request from "supertest";
import { Recipe } from "../models/Recipe";
import { Ingredients } from "../models/Ingredients";
import recipeRoutes from "../routes/recipe/recipe";
import express, { NextFunction } from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/recipebook", recipeRoutes);

jest.mock("../models/Recipe", () => ({
  Recipe: {
    findOne: jest.fn(),
  },
}));
jest.mock("../user/loginUser.controller", () => ({
  authenticateToken: (req: Request, res: Response, next: NextFunction) =>
    next(),
}));


describe("GET /api/recipes/:recipeId", () => {
  const mockRecipe = {
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
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a recipe with ingredients when recipe is found", async () => {
    (Recipe.findOne as jest.Mock).mockResolvedValue(mockRecipe);
    const response = await request(app).get("/recipebook/recipes/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body.title).toBe("Pancakes");
    expect(response.body.Ingredients.length).toBe(2);
    expect(response.body.Ingredients[0].name).toBe("Flour");
  });

  it("should return 404 if recipe is not found", async () => {
    (Recipe.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/recipebook/recipes/10");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Recipe not found");
  });

  it("should return 500 if there is an internal server error", async () => {
    (Recipe.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app).get("/recipebook/recipes/10");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Internal Server Error");
  });
});
