import path from "path";
import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";
import User from "../models/users.js";

const avatarsDir = path.resolve("public", "avatars");

export const processAndSaveAvatar = async (file, userId) => {
  if (!file) {
    throw HttpError(400, "Avatar file is required");
  }

  await fs.mkdir(avatarsDir, { recursive: true });

  const ext = path.extname(file.originalname);
  const fileName = `${userId}${ext}`;
  const finalPath = path.join(avatarsDir, fileName);

  try {
    await fs.rename(file.path, finalPath);
  } catch (err) {
    throw HttpError(500, "Failed to process avatar image");
  }

  const avatarURL = `/avatars/${fileName}`;

  try {
    await User.update({ avatarURL }, { where: { id: userId } });
  } catch (err) {
    throw HttpError(500, "Failed to update avatarURL in database");
  }

  return avatarURL;
};
