import { sequelize } from "./server";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user/user";
import request from "supertest";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/recipebook", userRoutes);

jest.mock("./server", () => ({
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
    define: jest.fn().mockReturnValue({
      id: { type: "INTEGER", primaryKey: true, autoIncrement: true },
      username: { type: "STRING", unique: true, allowNull: false },
      email: { type: "STRING", unique: true, allowNull: false },
      password: { type: "STRING", allowNull: false },
    }),
  },
}));

describe("App Initialization", () => {
  let server: any;

  beforeAll(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (server) {
      server.close();
    }
  });

  it("should return 200 for /recipebook route", async () => {
    (sequelize.authenticate as jest.Mock).mockResolvedValueOnce(undefined);
    (sequelize.sync as jest.Mock).mockResolvedValueOnce(undefined);

    server = app.listen(0, async () => {
      const response = await request(server).get("/recipebook");

      expect(response.status).toBe(200);
    });
  });

  it("should return 404 for a non-existent route", async () => {
    (sequelize.authenticate as jest.Mock).mockResolvedValueOnce(undefined);
    (sequelize.sync as jest.Mock).mockResolvedValueOnce(undefined);

    server = app.listen(0, async () => {
      const response = await request(server).get("/unknown");

      expect(response.status).toBe(404);
    });
  });
});
