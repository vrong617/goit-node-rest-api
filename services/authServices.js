import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import emailSender from "../services/emailSender.js";
import { v4 as uuidv4 } from "uuid";

const SECRET_KEY = process.env.JWT_SECRET || "defaultsecret";

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = uuidv4();
  const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  await emailSender.sendConfirmationEmail(email, verificationToken);

  return {
    email: newUser.email,
    subscription: newUser.subscription,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
  user.token = token;
  await user.save();

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const logoutUser = async (user) => {
  user.token = null;
  await user.save();
};

export const getCurrentUser = (user) => {
  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
};

export const verifyEmail = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verified) {
    throw HttpError(409, "User is already verified");
  }

  user.verified = true;
  user.verificationToken = null;
  await user.save();
};

export const resendVerificationEmail = async (email) => {
  if (!email) {
    throw HttpError(400, "Missing required field email");
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return;
  }

  if (user.verified) {
    throw HttpError(409, "Verification has already been passed");
  }

  const verificationToken = uuidv4();

  user.verificationToken = verificationToken;
  await user.save();

  await emailSender.sendConfirmationEmail(user.email, verificationToken);
};
