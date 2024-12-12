import { Request, Response } from "express";
import { User } from "../../models/User";
import { User as UserClass } from "../../classes/user/user";
import { User as userType } from "../../types/user";

export const postUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password, email, profileImage } = req.body;
  try {
    let existUser = await User.findOne({ where: { username: username } });

    if (existUser) {
      return res.status(200).json({ message: "User already exist" });
    }
    const new_user: userType = new UserClass(
      username,
      email,
      password,
      profileImage
    );
    await User.create(new_user);
    return res
      .status(201)
      .json({ message: "User created successfully", data: new_user });
  } catch (e) {
    return res.status(500).json({ message: `Error while user creation` });
  }
};
