import { Request, Response } from "express";
import prisma from "../db";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const getUserList = async (req: Request, res: Response): Promise<void> => {
  const page      = Number(req.query.page ?? 1);
  const limit     = Number(req.query.limit ?? 10);
  const role      = req.query.role as string | undefined;
  const email     = req.query.email as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate   = req.query.endDate as string | undefined;

  const skip = (page - 1) * limit;

  const where = {
    ...(role  && { role }),
    ...(email && { email: { contains: email, mode: "insensitive" as const } }),
    ...((startDate ?? endDate) ? {
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate   && { lte: new Date(endDate) }),
      },
    } : {}),
  };

  try {
    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    res.status(200).json({
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("getUserList error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
