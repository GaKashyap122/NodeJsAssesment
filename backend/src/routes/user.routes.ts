import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";
import { getProfile, getUserList } from "../controllers/user.controller";

const router = Router();

router.get("/profile", authenticate, getProfile);
router.get("/list", authenticate, authorizeAdmin, getUserList);

export default router;
