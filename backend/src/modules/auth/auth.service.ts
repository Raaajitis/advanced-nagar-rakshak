import { User } from "./auth.model";
import { RegisterUserDTO, LoginUserDTO } from "./auth.types";

import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

export const registerUser = async (
  payload: RegisterUserDTO
) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    password: hashedPassword,
    role: payload.role || "citizen",
  });

  return user;
};

export const loginUser = async (
  payload: LoginUserDTO
) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatched = await comparePassword(
    payload.password,
    user.password
  );

  if (!passwordMatched) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(
    user._id.toString(),
    user.role
  );

  return {
    user,
    token,
  };
};