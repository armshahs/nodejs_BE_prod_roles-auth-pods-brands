import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware";
import { ROLES } from "../config";
import { BrandController } from "../controllers";

const router = express.Router();

// Create brand
router.post(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.createBrand,
);
// Get all brands (for brandownership)
router.get(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.getAllBrandsOwnership,
);
// Get single brand details
router.get(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.getBrandDetails,
);
// Update specific brand details (Brand Ownership)
router.patch(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.updateBrandDetailsOwnership,
);
// Update specific brand details (Brand Ownership)
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  BrandController.deleteBrand,
);

export default router;
