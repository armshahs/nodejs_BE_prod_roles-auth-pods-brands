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
import { User, Brand } from "../models"; // Import User entity

@Entity()
@Index("idx_pod_leader_id", ["podLeader"])
export class Pod {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  // One Pod Leader (User) can be assigned to multiple Pods
  // Only set the SET NULL on Many to One, since if User model is deleted, then podLeader should be set null.
  @ManyToOne(() => User, (user) => user.leadPods, {
    onDelete: "SET NULL", // Pod leader can be removed without deleting the pod
    nullable: true,
  })
  @JoinColumn({ name: "pod_leader_id" })
  podLeader?: User | null;

  // One pod can have multiple members
  @OneToMany(() => User, (user) => user.pod)
  members?: User[];

  // One pod can have multiple brands linked to it
  @OneToMany(() => Brand, (brand) => brand.pod)
  brands?: Brand[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
