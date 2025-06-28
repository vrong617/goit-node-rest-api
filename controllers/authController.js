import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/authServices.js";

import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import HttpError from "../helpers/HttpError.js";
import User from "../models/users.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsDir = path.join(__dirname, "../public/avatars");

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = getCurrentUser(req.user);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Avatar file is required");
    }

    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname);
    const fileName = `${req.user.id}${ext}`;
    const finalPath = path.join(avatarsDir, fileName);

    await fs.rename(tempPath, finalPath);

    const avatarURL = `/avatars/${fileName}`;

    await User.update({ avatarURL }, { where: { id: req.user.id } });

    res.status(200).json({ avatarURL });
  } catch (err) {
    next(err);
  }
};
