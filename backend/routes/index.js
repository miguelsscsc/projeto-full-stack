import { Router } from "express";
import authRoutes from "./authRoutes.js";
import classRoutes from "./classRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import enrollmentRoutes from "./enrollmentRoutes.js";
import subjectRoutes from "./subjectRoutes.js";
import userRoutes from "./userRoutes.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use(authenticate);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/classes", classRoutes);
router.use("/subjects", subjectRoutes);
router.use("/enrollments", enrollmentRoutes);

export default router;
