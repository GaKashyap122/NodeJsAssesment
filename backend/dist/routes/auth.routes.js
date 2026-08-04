"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/sign-up", auth_controller_1.UserSignup);
router.post("/sign-in", auth_controller_1.UserLogin);
exports.default = router;
