import express from "express";
import { createUser } from "../../controllers/user/createUser";
import { getUser } from "../../controllers/user/getUser";
const userRoutes = express();
userRoutes.use(express.urlencoded({ extended: true }));
userRoutes.use(express.json());

userRoutes.post("/users", createUser);
userRoutes.get("/users", getUser);
export default userRoutes;
