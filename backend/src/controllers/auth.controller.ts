import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import prisma from "../db";

export const UserSignup = async (req: Request, res: Response): Promise<void> => {
  const firstName = (req.body.firstName as string)?.trim();
  const lastName  = (req.body.lastName as string)?.trim();
  const email     = (req.body.email as string)?.trim().toLowerCase();
  const password  = req.body.password as string;
  const role      = (req.body.role as string)?.trim().toLowerCase();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword, role },
    });
    res.status(201).json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const UserLogin = async (req: Request, res: Response): Promise<void> => {
  const email    = (req.body.email as string)?.trim().toLowerCase();
  const password = req.body.password as string;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const signOptions: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRY ?? "1h") as jwt.SignOptions["expiresIn"],
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, signOptions);

    res.status(200).json({ message: "Login successful", token });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
};
