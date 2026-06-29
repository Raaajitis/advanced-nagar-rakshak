import { Router } from "express";

import {
  register,
  login,
  logout,
  profile,
} from "./auth.controller";

import { authenticate } from "./auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get(
  "/profile",
  authenticate,
  profile
);

export default router;