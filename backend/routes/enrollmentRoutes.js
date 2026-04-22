import { Router } from "express";
import {
  createEnrollmentController,
  deleteEnrollmentController,
  getEnrollments,
  updateEnrollmentController,
} from "../controllers/enrollmentController.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { validate } from "../middlewares/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const adminEnrollmentRules = [
  { field: "student_id", required: true, type: "number" },
  { field: "subject_id", required: true, type: "number" },
  { field: "status", required: true, enum: ["active", "completed", "locked"] },
  { field: "attendance", required: true, type: "number" },
];

const teacherEnrollmentRules = [
  { field: "status", required: true, enum: ["active", "completed", "locked"] },
  { field: "attendance", required: true, type: "number" },
];

router.get("/", authorizeRoles("admin", "teacher", "student"), asyncHandler(getEnrollments));
router.post(
  "/",
  authorizeRoles("admin"),
  validate(adminEnrollmentRules),
  asyncHandler(createEnrollmentController)
);
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  (request, response, next) =>
    validate(request.user.role === "teacher" ? teacherEnrollmentRules : adminEnrollmentRules)(
      request,
      response,
      next
    ),
  asyncHandler(updateEnrollmentController)
);
router.delete("/:id", authorizeRoles("admin"), asyncHandler(deleteEnrollmentController));

export default router;
