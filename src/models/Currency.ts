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

  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  conversion_rate?: number | null; // Conversion rate to base currency (USD)
}
