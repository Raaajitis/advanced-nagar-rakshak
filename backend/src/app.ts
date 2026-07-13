import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import routes from "./routes";
import path from "path";
import fs from "fs";
import { env } from "./config/env";

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: env.FRONTEND_URL.includes(",")
      ? env.FRONTEND_URL.split(",")
      : env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/auth", authRoutes);

app.use("/api", routes);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Running"
  });
});

export default app;