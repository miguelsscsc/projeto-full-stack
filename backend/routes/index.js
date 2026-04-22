import { Router } from "express";
import authRoutes from "./authRoutes.js";
import classRoutes from "./classRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import enrollmentRoutes from "./enrollmentRoutes.js";
import gradeRoutes from "./gradeRoutes.js";
import studentRoutes from "./studentRoutes.js";
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
router.use("/students", studentRoutes);
router.use("/classes", classRoutes);
router.use("/subjects", subjectRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/grades", gradeRoutes);

export default router;
