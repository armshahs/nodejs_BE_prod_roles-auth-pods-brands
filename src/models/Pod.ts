import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { User } from "../models"; // Import User entity

@Entity()
@Index("idx_pod_leader_id", ["podLeader"])
export class Pod {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  // One Pod Leader (User) can be assigned to multiple Pods
  @ManyToOne(() => User, (user) => user.leadPods, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "pod_leader_id" })
  podLeader?: User | null;

  // One pod can have multiple members
  @OneToMany(() => User, (user) => user.pod)
  members?: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
