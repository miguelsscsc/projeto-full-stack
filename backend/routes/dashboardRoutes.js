import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", authorizeRoles("admin", "teacher", "student"), asyncHandler(getDashboard));

export default router;
