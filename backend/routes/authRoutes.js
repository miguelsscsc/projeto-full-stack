import { Router } from "express";
import { login, me, registerStudent } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/login",
  validate([
    { field: "email", required: true, type: "email" },
    { field: "password", required: true, minLength: 6 },
  ]),
  asyncHandler(login)
);

router.post(
  "/register",
  validate([
    { field: "name", required: true, minLength: 3 },
    { field: "email", required: true, type: "email" },
    { field: "password", required: true, minLength: 6 },
  ]),
  asyncHandler(registerStudent)
);

router.get("/me", authenticate, asyncHandler(me));

export default router;
