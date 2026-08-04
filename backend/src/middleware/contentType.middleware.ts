import { Request, Response, NextFunction } from "express";

// Rejects POST/PUT/PATCH requests that don't send application/json
export const enforceJsonContentType = (req: Request, res: Response, next: NextFunction): void => {
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
