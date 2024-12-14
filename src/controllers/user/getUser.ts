import { Request, Response } from "express";
import { Users } from "../../models/User";
import { User } from "../../classes/user/user";
import argon2 from "argon2";

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const username = req.query.username as string;
  const password = req.query.password as string;

  try {
    let existUser: any = await Users.findOne({
      where: {
        username: username,
      },
    });
    if (!existUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const user = new User(
      existUser.dataValues.username,
      existUser.dataValues.email,
      existUser.dataValues.password,
      existUser.dataValues.country
    );
    const passwordMatch = await argon2.verify(
      existUser.dataValues.password,
      password
    );
    if (!passwordMatch) {
      res.status(400).json({ message: "Incorrect Password" });
      return;
    }

    return res
      .status(200)
      .json({ message: "User retrieved successfully", data: user });
  } catch (e) {
    return res.status(500).json({ message: "Error while user retrieving" });
  }
};
