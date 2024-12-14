import { Request, Response } from "express";
import { Users } from "../../models/User";
import { User } from "../../classes/user/user";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password, email, country } = req.body;
  try {
    let existUser = await Users.findOne({ where: { username: username } });

    if (existUser) {
      return res.status(200).json({ message: "User already exist" });
    }
    const new_user = new User(username, email, password, country);
    await new_user.encryptPassword();

    await Users.create({
      username: new_user.username,
      password: new_user.password,
      email: new_user.email,
      country: new_user.country,
    });
    return res
      .status(201)
      .json({ message: "User created successfully", data: new_user });
  } catch (e) {
    return res.status(500).json({ message: `Error while user creation` });
  }
};
