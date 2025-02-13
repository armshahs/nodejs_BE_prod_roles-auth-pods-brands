import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware";
import { ROLES } from "../config";
import { BrandController } from "../controllers";

const router = express.Router();

// Create brand - admin only
router.post(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.createBrand,
);
// Get all brands (for brandownership) - admin only
router.get(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.getAllBrandsOwnership,
);
// Get all brands for me
router.get("/me", authenticateJWT, BrandController.getAllBrandsForMe);
// Get single brand details - admin only
router.get(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.getBrandDetails,
);
// Update specific brand details (Brand Ownership) - admin only
router.patch(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.updateBrandDetailsOwnership,
);
// Update specific brand details (Brand Ownership) - admin only
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.deleteBrand,
);

export default router;
