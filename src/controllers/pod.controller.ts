import { Request, Response } from "express";
import { PodService } from "../services";

export class PodController {
  static async createPod(req: Request, res: Response) {
    const { name, pod_leader_id, members } = req.body;

    try {
      // Call the service method to create a pod
      if (!name || !pod_leader_id || !members) {
        res.status(400).json({ message: "Missing parameters" });
        return;
      }
      const pod = await PodService.createPod(name, pod_leader_id, members);
      res.status(201).json(pod);
    } catch (error) {
      console.error(error);
      const err = error as Error; // Type assertion
      res.status(500).json({ message: err.message });
      return;
    }
  }

  // Get all pods
  static async getAllPods(req: Request, res: Response) {
    try {
      const pods = await PodService.getAllPods();
      res.status(200).json(pods);
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Get a pod by ID
  static async getPodById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const pod = await PodService.getPodById(id);
      res.status(200).json(pod);
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
    }
  }

  // Update pod details
  static async updatePod(req: Request, res: Response) {
    const { id } = req.params;
    const { name, pod_leader_id, members } = req.body;
    try {
      const updatedPod = await PodService.updatePod(
        id,
        name,
        pod_leader_id,
        members,
      );
      res.status(200).json(updatedPod);
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Delete pod
  static async deletePod(req: Request, res: Response) {
    try {
      await PodService.deletePod(req.params.id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(500).json({ message: err.message });
      return;
    }
  }
}
