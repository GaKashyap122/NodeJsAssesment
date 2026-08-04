import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { enforceJsonContentType } from "./middleware/contentType.middleware";
import { authRateLimiter } from "./middleware/rateLimit.middleware";
import { requestLogger } from "./middleware/logger.middleware";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Security & parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(enforceJsonContentType);

// Routes
app.use("/auth", authRateLimiter, authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
