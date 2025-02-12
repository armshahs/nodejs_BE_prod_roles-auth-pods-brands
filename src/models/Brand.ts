import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { User, Pod } from "../models"; // Import User entity

@Entity()
@Index("idx_brand_performance_marketer_id", ["performanceMarketer"])
@Index("idx_brand_pod_id", ["pod"])
@Index("idx_brand_pod_lead_id", ["podLead"])
export class Brand {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  // One performance marketer (key user who manages brand performance)
  @ManyToOne(() => User, (user) => user.performanceBrands, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "performance_marketer_id" })
  performanceMarketer?: User | null;

  // One pod is linked based on the performanceMarketer's pod (Optional)
  @ManyToOne(() => Pod, (pod) => pod.brands, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "pod_id" })
  pod?: Pod | null;

  // One pod lead (Renamed from teamLead)
  @ManyToOne(() => User, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "pod_lead_id" }) // Updated JoinColumn name
  podLead?: User | null;

  // A single list for all members (Optional)
  @ManyToMany(() => User, (user) => user.brands, { nullable: true })
  @JoinTable()
  members?: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
