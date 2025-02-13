import { Entity, Column } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity()
export class Currency extends BaseModel {
  @Column({ unique: true })
  code!: string; // e.g., "USD", "EUR"

  @Column()
  name!: string; // e.g., "US Dollar", "Euro"

  @Column()
  symbol!: string; // e.g., "$", "€"
}
