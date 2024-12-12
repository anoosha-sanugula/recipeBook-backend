import { connectToDatabase, sequelize } from "./database";

jest.mock("./database", () => ({
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
  },
  connectToDatabase: jest.fn(),
}));
jest.mock("console");

describe("Database Connection and Synchronization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should synchronize models with the database", async () => {
    await connectToDatabase();
    await sequelize.sync({ force: false });
    expect(sequelize.sync).toHaveBeenCalledWith({ force: false });
  });
});
