import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from "typeorm";
import { CompanyDto } from "../dto/company.dto";
import { createId } from "@paralleldrive/cuid2";
import { IsCuid } from '../../validators/cuid.validator';

@Entity()
export class Company {
  @IsCuid({ message: "Invalid user ID format" })
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  document: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date;

  @Column()
  deleted: boolean;

  @BeforeInsert()
  generateId() {
    this.id = createId();
    this.created_at = new Date();
    this.deleted = false;
  }

  @BeforeUpdate()
  updateDate() {
    this.updated_at = new Date();
  }

  toDTO(): CompanyDto {
    return {
      ...this,
    };
  }
}
