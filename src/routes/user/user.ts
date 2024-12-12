import express from "express";
import { postUser } from "../../controllers/user/postUser";
import { getUser } from "../../controllers/user/getUser";
const userRoutes = express();
userRoutes.use(express.urlencoded({ extended: true }));
userRoutes.use(express.json());

userRoutes.post("/users", postUser);
userRoutes.get("/users", getUser);
export default userRoutes;
