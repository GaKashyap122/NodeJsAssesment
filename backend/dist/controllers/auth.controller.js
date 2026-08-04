"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogin = exports.UserSignup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("../db"));
const UserSignup = async (req, res) => {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const role = req.body.role?.trim().toLowerCase();
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    try {
        const user = await db_1.default.user.create({
            data: { firstName, lastName, email, password: hashedPassword, role },
        });
        res.status(201).json({ message: "User created successfully", userId: user.id });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(400).json({ error: "User with this email already exists" });
            return;
        }
        res.status(500).json({ error: "Failed to create user" });
    }
};
exports.UserSignup = UserSignup;
const UserLogin = async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
    }
    try {
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const payload = { userId: user.id, email: user.email, role: user.role };
        const signOptions = {
            expiresIn: (process.env.JWT_EXPIRY ?? "1h"),
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, signOptions);
        res.status(200).json({ message: "Login successful", token });
    }
    catch {
        res.status(500).json({ error: "Login failed" });
    }
};
exports.UserLogin = UserLogin;
