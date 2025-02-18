import {IUser} from '../interface/user.interface';

import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn} from 'typeorm';
import {createId} from '@paralleldrive/cuid2';

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column({unique: true})
  email: string

  @Column({nullable: true,})
  password: string

  @Column()
  created_at: Date

  @Column({nullable: true})
  updated_at: Date

  @Column()
  deleted: boolean

  @BeforeInsert()
  generateId() {
    this.id = createId();
    this.created_at = new Date()
    this.deleted = false
  }

  @BeforeUpdate()
  updateDate() {
    this.updated_at = new Date()
  }

  toDTO(): IUser {
    return {
      ...this
    }
  }
}
