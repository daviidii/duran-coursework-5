import { jwtVerify } from "jose";
import DuranUsersModel from "../models/userModel.js";
import { refreshToken } from "../controller/duranUserController.js";
import { verifyAccessToken } from "../utils/authUtils.js";

const key = new TextEncoder().encode("secret");

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      console.log("accessToken >>>", accessToken);
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await verifyAccessToken(accessToken);
    req.user = user;

    next();
  } catch (error) {
    console.error("error >>> ", error);
    if (error.code === "ERR_JWT_EXPIRED") {
      return refreshToken(req, res, next);
    }

    res.status(401).json({ message: "Session expired - Please login again" });
  }
};
