import { Router } from "express";

import multer from "multer";

import { authenticate } from "../auth/auth.middleware";

import {
  create,
  getAll,
} from "./issue.controller";

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(null, "uploads/");
  },

  filename: (
    req,
    file,
    cb
  ) => {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );
  },
});

const upload = multer({
  storage,
});

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("image"),
  create
);

router.get("/", getAll);

export default router;