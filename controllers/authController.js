import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/authServices.js";

import { processAndSaveAvatar } from "../services/avatarService.js";

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
    const avatarURL = await processAndSaveAvatar(req.file, req.user.id);
    res.status(200).json({ avatarURL });
  } catch (err) {
    next(err);
  }
};
