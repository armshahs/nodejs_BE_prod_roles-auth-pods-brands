import express from "express";
import { AuthController } from "../controllers";
import { authenticateJWT, authorizeRole } from "../middleware";
import { ROLES } from "../config";

const router = express.Router();

router.post("/signup-admin", AuthController.signUp);
router.post(
  "/signup",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.signUp,
); // Always add authenticateJWT before authorizeRole or else it will not get req.user
router.post("/login", AuthController.login);
router.get("/me", authenticateJWT, AuthController.getUserDetails);

// Reset password for sending email, reset password-confirm for changing password.
router.post("/reset-password", AuthController.resetPasswordRequest);
router.post("/reset-password-confirm", AuthController.resetPasswordConfirm);

// Get all Users or update users - admin access only
router.get(
  "/users",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.getAllUsers,
);
router.patch(
  "/users/:userId/role",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.updateUserRole,
);

export default router;
