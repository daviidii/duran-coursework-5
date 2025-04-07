import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import DuranUsersModel from "../models/userModel.js";

const SALT_ROUNDS = 12;

const secret = "secret";
const key = new TextEncoder().encode(secret);

const generateAccessToken = async (userId) => {
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // Short-lived access token
    .sign(key);
};

const generateRefreshToken = async (userId) => {
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Long-lived refresh token
    .sign(key);
};

export const register = async (req, res) => {
  try {
    const { username, email, pass } = req.body;

    // Validation
    if (!username || !email || !pass) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await DuranUsersModel.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const user = await DuranUsersModel.create({
      username,
      email,
      pass: hashedPassword,
    });

    // generate access and refresh tokens
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    const user = await DuranUsersModel.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "account does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(pass, user.pass);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "incorrect email or password" });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      message: "login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json("no token");
    }

    const { payload } = await jwtVerify(refreshToken, key);

    const user = await DuranUsersModel.findByPk(payload?.id);

    const newAccessToken = await generateAccessToken(payload?.id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    const user_data = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };

    res.json({
      user: user_data,
    });
  } catch (error) {
    res.status(403).json({ message: "invalid refresh token" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(200).json({
        isAuthenticated: false,
        message: "No token provided",
      });
    }

    const user = await verifyAccessToken(token);
    return res.json({
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    if (error.code === "ERR_JWT_EXPIRED") {
      return res.status(200).json({
        isAuthenticated: false,
        shouldRefresh: true,
        message: "Token expired",
      });
    }

    return res.status(200).json({
      isAuthenticated: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
