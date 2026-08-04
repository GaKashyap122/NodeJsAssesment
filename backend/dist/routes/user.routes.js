"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get("/profile", auth_middleware_1.authenticate, user_controller_1.getProfile);
router.get("/list", auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, user_controller_1.getUserList);
exports.default = router;
