import { User as UserClass } from "../../classes/user/user";
import { Sequelize } from "sequelize";
import userRoutes from "../../routes/user/user";
import request from "supertest";
import { User as userType } from "../../types/user";
import express from "express";
import { User } from "../../models/User";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/recipebook", userRoutes);
jest.mock("../../models/User", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("POST /users", () => {
  const validUser: userType = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    profileImage: "./gallery/image.jpg",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user successfully", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue(validUser);

    const response = await request(app)
      .post("/recipebook/users")
      .send(validUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.data.username).toBe(validUser.username);
    expect(response.body.data.email).toBe(validUser.email);
  });

  it("should return an error if the user already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(validUser);

    const response = await request(app)
      .post("/recipebook/users")
      .send(validUser);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User already exist");
  });

  it("should return an error if there is a server issue", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/recipebook/users")
      .send(validUser);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error while user creation");
  });
});
