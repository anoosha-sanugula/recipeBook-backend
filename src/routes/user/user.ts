import express from "express";
import { createUser } from "../../user/createUser.controller";
import { loginUser } from "../../user/loginUser.controller";
const userRoutes = express();
userRoutes.use(express.urlencoded({ extended: true }));
userRoutes.use(express.json());

userRoutes.post("/users", createUser);
userRoutes.post("/user", loginUser);
export default userRoutes;
