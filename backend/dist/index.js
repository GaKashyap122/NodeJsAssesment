"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const contentType_middleware_1 = require("./middleware/contentType.middleware");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const logger_middleware_1 = require("./middleware/logger.middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
// Security & parsing middleware
app.use(express_1.default.json({ limit: "10kb" }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(logger_middleware_1.requestLogger);
app.use(contentType_middleware_1.enforceJsonContentType);
// Routes
app.use("/auth", rateLimit_middleware_1.authRateLimiter, auth_routes_1.default);
app.use("/user", user_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
