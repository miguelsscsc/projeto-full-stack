import { Router } from "express";
import {
  createClassController,
  deleteClassController,
  getClasses,
  updateClassController,
} from "../controllers/classController.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { validate } from "../middlewares/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const classRules = [
  { field: "name", required: true, minLength: 2 },
  { field: "school_year", required: true, type: "number" },
  { field: "shift", required: true },
  { field: "room", required: true },
];

router.get("/", authorizeRoles("admin", "teacher", "student"), asyncHandler(getClasses));
router.post("/", authorizeRoles("admin"), validate(classRules), asyncHandler(createClassController));
router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(classRules),
  asyncHandler(updateClassController)
);
router.delete("/:id", authorizeRoles("admin"), asyncHandler(deleteClassController));

export default router;
