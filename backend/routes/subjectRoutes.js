import { Router } from "express";
import {
  createSubjectController,
  deleteSubjectController,
  getSubjects,
  updateSubjectController,
} from "../controllers/subjectController.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { validate } from "../middlewares/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const subjectRules = [
  { field: "name", required: true, minLength: 2 },
  { field: "workload", required: true, type: "number" },
  { field: "teacher_id", required: true, type: "number" },
  { field: "class_id", required: true, type: "number" },
];

router.get("/", authorizeRoles("admin", "teacher", "student"), asyncHandler(getSubjects));
router.post("/", authorizeRoles("admin"), validate(subjectRules), asyncHandler(createSubjectController));
router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(subjectRules),
  asyncHandler(updateSubjectController)
);
router.delete("/:id", authorizeRoles("admin"), asyncHandler(deleteSubjectController));

export default router;
