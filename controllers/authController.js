import * as authService from "../services/authServices.js";

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

export const verifyEmail = async (req, res, next) => {
  try {
    const {verificationToken} = req.params;
    await authService.verifyEmail(verificationToken);
    res.status(200).json({message: "Verification successful"});
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const {email} = req.body;
    await authService.resendVerificationEmail(email);
    res.status(200).json({message: "Verification email sent"});
  } catch (error) {
    next(error);
  }
};
