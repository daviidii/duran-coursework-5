import { jwtVerify } from "jose";
import DuranUsersModel from "../models/userModel.js";

const key = new TextEncoder().encode("secret");

export const verifyAccessToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, key);

    if (!payload?.id || typeof payload?.id !== "number") {
      throw new Error("Invalid token payload");
    }

    const user = await DuranUsersModel.findByPk(payload.id, {
      attributes: { exclude: ["pass"] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
  } catch (error) {
    throw error;
  }
};
