import { In } from "typeorm";
import { AppDataSource } from "../database";
import { Pod } from "../models";
import { User } from "../models";
import { ROLES, pod_selection } from "../config";

const podRepository = AppDataSource.getRepository(Pod);
const userRepository = AppDataSource.getRepository(User);

export class PodService {
  static async createPod(
    name: string,
    pod_leader_id: string,
    members: string[] = [],
  ) {
    // Check if the pod leader exists
    const podLeader = await userRepository.findOne({
      where: { id: pod_leader_id },
      select: ["id", "email", "name", "role"],
    });
    if (!podLeader) {
      throw new Error("Pod Leader not found");
    }
    // If a member is assigned as a team lead, change role to team lead. But if they are admin, do not change.
    if (podLeader.role === ROLES.TEAM_MEMBER) {
      podLeader.role = ROLES.TEAM_LEAD;
      await userRepository.save(podLeader); // Save the updated pod leader role in the DB
    }

    // Ensure the pod leader is included in the members list if it's not already there
    if (!members.includes(pod_leader_id)) {
      members.push(pod_leader_id);
    }

    // Check if all members exist
    let users: User[] = [];
    if (members.length > 0) {
      users = await userRepository.find({
        where: { id: In(members) },
        select: ["id", "email", "name", "role"],
      });

      // Find which members are missing
      const foundUserIds = users.map((user) => user.id);
      const missingMembers = members.filter(
        (memberId) => !foundUserIds.includes(memberId),
      );

      // If there are missing members, throw an error with the list of missing members
      if (missingMembers.length > 0) {
        throw new Error(`Members not found: ${missingMembers.join(", ")}`);
      }
    }

    // Create new pod
    const pod = new Pod();
    pod.name = name;
    pod.podLeader = podLeader;
    pod.members = users;
    // pod.members = [...users, podLeader]; // Adds pod leader to the team.

    // Save the pod to the database
    return await podRepository.save(pod);
  }

  // Get all pods--------------------
  static async getAllPods() {
    return await podRepository.find({
      relations: ["podLeader", "members"],
      select: pod_selection,
    });
  }

  // Get a pod by ID---------------------------
  static async getPodById(id: string) {
    const pod = await podRepository.findOne({
      where: { id },
      relations: ["podLeader", "members"],
      select: pod_selection,
    });
    if (!pod) {
      throw new Error("Pod not found");
    }
    return pod;
  }

  // Update pod details
  static async updatePod(
    id: string,
    name: string,
    pod_leader_id: string,
    members: string[],
  ) {
    if (!id || !name || !pod_leader_id || !members) {
      throw new Error("Request body or request parameter fields missing");
    }

    // Fetch pod details
    const pod = await podRepository.findOne({
      where: { id },
      relations: ["podLeader", "members"],
      select: pod_selection,
    });

    if (!pod || !pod.podLeader) {
      throw new Error("Pod or Pod Leader not found");
    }

    // Update name
    pod.name = name;

    // Update role of previous pod leader to team_member if it was team_lead. Do not update admins.
    const prevPodLeader = await userRepository.findOne({
      where: { id: pod.podLeader.id },
      select: ["id", "email", "name", "role"],
    });
    console.log("prevPodLeader", prevPodLeader);
    if (!prevPodLeader) {
      throw new Error("Pod Leader not found");
    }
    if (prevPodLeader.role === ROLES.TEAM_LEAD) {
      // Only update if the current pod leader is not an admin
      prevPodLeader.role = ROLES.TEAM_MEMBER; // Change role to TEAM_MEMBER
      await userRepository.save(prevPodLeader); // Save the updated role
    }

    // Fetch the new pod leader based on the provided pod_leader_id
    const newPodLeader = await userRepository.findOne({
      where: { id: pod_leader_id },
      select: ["id", "email", "name", "role"],
    });
    if (!newPodLeader) {
      throw new Error("New Pod Leader not found");
    }
    pod.podLeader = newPodLeader;
    if (newPodLeader.role === ROLES.TEAM_MEMBER) {
      newPodLeader.role = ROLES.TEAM_LEAD;
      await userRepository.save(newPodLeader); // Save the updated pod leader role in the DB
    }

    // Update members. Ensure the new pod leader is included in the members list if it's not already there
    if (!members.includes(pod_leader_id)) {
      members.push(pod_leader_id);
    }
    const foundUsers = await userRepository.find({
      where: { id: In(members) },
      select: ["id", "email", "name", "role"],
    });
    pod.members = foundUsers;

    return await podRepository.save(pod);
  }

  //
}
