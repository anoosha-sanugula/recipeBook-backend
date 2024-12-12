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
  },
}));

describe("GET /users?{username&password}", () => {
  const validUser: userType = {
    username: "Hari",
    email: "hari@gmail.com",
    password: "hari@123",
    profileImage: "./gallery/image.jpg",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create retrieve user successfully", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(validUser);

    const response = await request(app).get(
      "/recipebook/users?username=Hari&password=hari@123"
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User retrieved successfully");
    expect(response.body.data.username).toBe(validUser.username);
    expect(response.body.data.email).toBe(validUser.email);
  });

  it("should return an error if the user not exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get(
      "/recipebook/users?username=Hari&password=hari@123"
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User doesn't exist");
  });

  it("should return an error if there is a server issue", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).get(
      "/recipebook/users?username=Hari&password=hari@123"
    );

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error while user retrieving");
  });
});
