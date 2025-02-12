import { Request, Response } from "express";
import { Bookmarks } from "../models/Bookmarks";

export const createBookmark = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, recipeId, isBookmarked } = req.body;
  if (
    !userId ||
    !recipeId ||
    !isBookmarked ||
    ![true, false].includes(isBookmarked)
  ) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    if (isBookmarked) {
      const existingBookmark = await Bookmarks.findOne({
        where: { userId, recipeId },
      });
      if (existingBookmark) {
        return res.status(400).json({ message: "Recipe already bookmarked" });
      }
      await Bookmarks.create({ userId, recipeId });
      return res
        .status(200)
        .json({ success: true, message: "Recipe bookmarked" });
    } else if (!isBookmarked) {
      const bookmark = await Bookmarks.findOne({
        where: { userId, recipeId },
      });
      if (!bookmark) {
        return res.status(400).json({ message: "Bookmark not found" });
      }
      await bookmark.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Bookmark removed" });
    }
  } catch (error) {
    console.error("Error while processing bookmark:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
