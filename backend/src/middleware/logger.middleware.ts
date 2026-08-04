import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

// Structured request logger — logs method, path, status, duration, requestId
// Never logs body or Authorization headers (no sensitive data)
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  req.requestId = randomUUID();
  const start = Date.now();

  res.on("finish", () => {
    console.log(JSON.stringify({
      requestId:  req.requestId,
      method:     req.method,
      path:       req.path,
      status:     res.statusCode,
      durationMs: Date.now() - start,
    }));
  });

  next();
};
