"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const crypto_1 = require("crypto");
// Structured request logger — logs method, path, status, duration, requestId
// Never logs body or Authorization headers (no sensitive data)
const requestLogger = (req, res, next) => {
    req.requestId = (0, crypto_1.randomUUID)();
    const start = Date.now();
    res.on("finish", () => {
        console.log(JSON.stringify({
            requestId: req.requestId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: Date.now() - start,
        }));
    });
    next();
};
exports.requestLogger = requestLogger;
