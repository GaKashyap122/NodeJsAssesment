"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserList = exports.getProfile = void 0;
const db_1 = __importDefault(require("../db"));
const getProfile = async (req, res) => {
    try {
        const user = await db_1.default.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, firstName: true, lastName: true, email: true, role: true },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};
exports.getProfile = getProfile;
const getUserList = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const role = req.query.role;
    const email = req.query.email;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const skip = (page - 1) * limit;
    const where = {
        ...(role && { role }),
        ...(email && { email: { contains: email, mode: "insensitive" } }),
        ...((startDate ?? endDate) ? {
            createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
            },
        } : {}),
    };
    try {
        const [total, users] = await Promise.all([
            db_1.default.user.count({ where }),
            db_1.default.user.findMany({
                where,
                skip,
                take: limit,
                select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
                orderBy: { createdAt: "desc" },
            }),
        ]);
        res.status(200).json({
            data: users,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (err) {
        console.error("getUserList error:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getUserList = getUserList;
