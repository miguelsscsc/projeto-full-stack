import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUsers,
  updateUserController,
} from "../controllers/userController.js";
import { authorizeRoles } from "../middlewares/roles.js";
import { validate } from "../middlewares/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const userRules = [
  { field: "name", required: true, minLength: 3 },
  { field: "email", required: true, type: "email" },
  { field: "role", required: true, enum: ["admin", "teacher", "student"] },
];

router.get("/", authorizeRoles("admin"), asyncHandler(getUsers));
router.post(
  "/",
  authorizeRoles("admin"),
  validate([...userRules, { field: "password", required: true, minLength: 6 }]),
  asyncHandler(createUserController)
);
router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(userRules),
  asyncHandler(updateUserController)
);
router.delete("/:id", authorizeRoles("admin"), asyncHandler(deleteUserController));

export default router;
