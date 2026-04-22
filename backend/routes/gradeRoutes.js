import { Router } from "express";
import {
  createGradeController,
  deleteGradeController,
  getGrades,
  updateGradeController,
} from "../controllers/gradeController.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { validate } from "../middlewares/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const gradeRules = [
  { field: "enrollment_id", required: true, type: "number" },
  { field: "title", required: true, minLength: 2 },
  { field: "score", required: true, type: "number" },
  { field: "weight", required: true, type: "number" },
];

router.get("/", authorizeRoles("admin", "teacher", "student"), asyncHandler(getGrades));
router.post(
  "/",
  authorizeRoles("admin", "teacher"),
  validate(gradeRules),
  asyncHandler(createGradeController)
);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  validate(gradeRules),
  asyncHandler(updateGradeController)
);
router.delete("/:id", authorizeRoles("admin", "teacher"), asyncHandler(deleteGradeController));

export default router;
