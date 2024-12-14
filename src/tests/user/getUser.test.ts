import userRoutes from "../../routes/user/user";
import request from "supertest";
import express from "express";
import { Users } from "../../models/User";
import argon2 from "argon2";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/recipebook", userRoutes);
jest.mock("../../models/User", () => ({
  Users: {
    findOne: jest.fn(),
  },
}));
jest.mock("argon2", () => ({
  verify: jest.fn(),
}));

describe("GET /users?{username&password}", () => {
  const validUser = {
    username: "Hari",
    email: "hari@gmail.com",
    password: "hari@123",
    country: "India",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve user successfully", async () => {
    (Users.findOne as jest.Mock).mockResolvedValue({
      dataValues: validUser,
    });

    (argon2.verify as jest.Mock).mockResolvedValue(true);

    const response = await request(app).get(
      "/recipebook/users?username=Hari&password=hari@123"
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User retrieved successfully");
    expect(response.body.data.username).toBe(validUser.username);
    expect(response.body.data.email).toBe(validUser.email);
  });

  it("should return an error if the user not exists", async () => {
    (Users.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get(
      "/recipebook/users?username=Hari&password=hari@123"
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User doesn't exist");
  });
  it("should return an error if the password is incorrect", async () => {
    (Users.findOne as jest.Mock).mockResolvedValue({
      dataValues: validUser,
    });
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    const response = await request(app).get(
      "/recipebook/users?username=Hari&password=wrongpassword"
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Incorrect Password");
  });

  it("should return an error if there is a server issue", async () => {
    (Users.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).get(
      "/recipebook/users?username=Hari&password=hari@123"
    );

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error while user retrieving");
  });
});
