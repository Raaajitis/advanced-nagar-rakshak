import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDatabase } from "./database/database";
import { User } from "./modules/auth/auth.model";

import { env } from "./config/env";
const PORT = env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  const users = await User.countDocuments();

console.log(`Users in database: ${users}`);
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );
  });
};

startServer();
