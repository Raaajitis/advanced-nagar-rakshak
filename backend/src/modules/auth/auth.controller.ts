import { Request, Response } from "express";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation";

import {
  registerUser,
  loginUser,
} from "./auth.service";

import { sendResponse } from "../../utils/response";
import { env } from "../../config/env";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return sendResponse(
      res,
      201,
      true,
      "User registered successfully",
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    );
  } catch (error: any) {
    return sendResponse(
      res,
      400,
      false,
      error.message
    );
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const data = loginSchema.parse(req.body);

    const { user, token } =
      await loginUser(data);

    const isProduction = env.NODE_ENV === "production";
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(
      res,
      200,
      true,
      "Login successful",
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    );
  } catch (error: any) {
    return sendResponse(
      res,
      401,
      false,
      error.message
    );
  }
};

export const logout = async (
  req: Request,
  res: Response
) => {
  const isProduction = env.NODE_ENV === "production";
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return sendResponse(
    res,
    200,
    true,
    "Logged out successfully"
  );
};

export const profile = async (
  req: Request,
  res: Response
) => {
  return sendResponse(
    res,
    200,
    true,
    "Profile fetched",
    (req as any).user
  );
};