import express from "express";
import { postUser } from "../../controllers/user/postUser";
const userRoutes = express();
userRoutes.use(express.urlencoded({ extended: true }));
userRoutes.use(express.json());

userRoutes.post("/users", postUser);
export default userRoutes;
