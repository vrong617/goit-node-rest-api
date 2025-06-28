import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import HttpError from "../helpers/HttpError.js";

const SECRET_KEY = process.env.JWT_SECRET || "defaultsecret";

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await User.create({ email, password });

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
  };
};
