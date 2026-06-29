import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  id: string;
  role: string;
}

export const generateToken = (
  id: string,
  role: string
): string => {
  const payload: JwtPayload = {
    id,
    role,
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (
  token: string
): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};