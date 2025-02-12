import { Request, Response } from "express";
import { BrandService } from "../services";
import { logger, logError } from "../utils";

export class BrandController {
  // Create brand -----------------------------------------------
  static async createBrand(req: Request, res: Response): Promise<void> {
    try {
      // While destructuring the code, req.body assigns undefined to performanceMarketerID which is fine since it is optional.
      const { name, performanceMarketerId } = req.body;
      const newBrand = await BrandService.createBrand(
        name,
        performanceMarketerId,
      );
      res.status(201).json(newBrand);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Get all brands (brand ownership) -----------------------------------------------------------
  static async getAllBrandsOwnership(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const brands = await BrandService.getAllBrandsOwnership();
      res.status(200).json(brands);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Get specific brand details -----------------------------------------------------------
  static async getBrandDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const brand = await BrandService.getBrandDetails(id);
      res.status(200).json(brand);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Update specific brand details (Brand Ownership) -----------------------------------------------------------
  static async updateBrandDetailsOwnership(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { performanceMarketerId } = req.body;
      const brand = await BrandService.updateBrandDetailsOwnership(
        id,
        performanceMarketerId,
      );
      res.status(200).json(brand);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Delete specific brand -----------------------------------------------------------
  static async deleteBrand(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await BrandService.deleteBrand(id);
      res.status(204).json();
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }
}
