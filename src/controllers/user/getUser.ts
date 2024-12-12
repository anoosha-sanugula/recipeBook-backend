import { Request, Response } from "express";
import { User } from "../../models/User";
import { User as UserClass } from "../../classes/user/user";
import { User as userType } from "../../types/user";

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const username = req.query.username as string;
  const password = req.query.password as string;

  try {
    let existUser: any = await User.findOne({
      where: {
        username: username,
        password: password,
      },
    });
    if (!existUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const user: userType = new UserClass(
      existUser.username,
      existUser.email,
      existUser.password,
      existUser.profileImage
    );
    return res
      .status(200)
      .json({ message: "User retrieved successfully", data: user });
  } catch (e) {
    return res.status(500).json({ message: "Error while user retrieving" });
  }
};
