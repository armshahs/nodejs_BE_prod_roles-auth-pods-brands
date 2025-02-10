import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import { ROLES, RoleType } from "../config";
import { Pod } from "../models";

@Entity()
@Index("idx_email", ["email"])
@Index("idx_pod_id", ["pod"])
@Index("idx_role", ["role"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ type: "enum", enum: ROLES, default: ROLES.CLIENT })
  role!: RoleType;

  // Multiple users can be members of a single pod
  // One User can belong to only one Pod as a member
  @ManyToOne(() => Pod, (pod) => pod.members, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "pod_id" })
  pod?: Pod | null;

  // One User can lead multiple Pods
  @OneToMany(() => Pod, (pod) => pod.podLeader, { nullable: true })
  leadPods?: Pod[] | null; // If the user is a leader, link to the pod leader's pod

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
