"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceJsonContentType = void 0;
// Rejects POST/PUT/PATCH requests that don't send application/json
const enforceJsonContentType = (req, res, next) => {
    const methodsRequiringJson = ["POST", "PUT", "PATCH"];
    if (methodsRequiringJson.includes(req.method)) {
        const contentType = req.headers["content-type"] ?? "";
        if (!contentType.includes("application/json")) {
            res.status(415).json({ error: "Content-Type must be application/json" });
            return;
        }
    }
    next();
};
exports.enforceJsonContentType = enforceJsonContentType;
