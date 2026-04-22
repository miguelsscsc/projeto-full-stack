import { Router } from "express";
import {
  createStudentController,
  deleteStudentController,
  getStudents,
  updateStudentController,
} from "../controllers/studentController.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { validate } from "../middlewares/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const studentRules = [
  { field: "user_id", required: true, type: "number" },
  { field: "registration_number", required: true, minLength: 4 },
];

router.get("/", authorizeRoles("admin", "teacher"), asyncHandler(getStudents));
router.post("/", authorizeRoles("admin"), validate(studentRules), asyncHandler(createStudentController));
router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(studentRules),
  asyncHandler(updateStudentController)
);
router.delete("/:id", authorizeRoles("admin"), asyncHandler(deleteStudentController));

export default router;
