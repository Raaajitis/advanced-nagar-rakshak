import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import routes from "./routes";
import path from "path";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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