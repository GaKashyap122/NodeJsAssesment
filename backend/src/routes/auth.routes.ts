import { Router } from "express";
import { UserSignup, UserLogin } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-up", UserSignup);
router.post("/sign-in", UserLogin);

export default router;
