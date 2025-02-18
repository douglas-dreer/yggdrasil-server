import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interface/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    { id: 1, email: 'admin@email.com', password: 'Password@1234567',  created_at: new Date(), updated_at: new Date(), deleted: false},
    { id: 2, email: 'joao.silva@email.com', password: 'Password@1234567',  created_at: new Date(), updated_at: new Date(), deleted: false},
    { id: 3, email: 'lucas.santos@email.com', password: 'Password@1234567',  created_at: new Date(), updated_at: new Date(), deleted: false},
    { id: 99, email: 'lucas.santos@email.com', password: 'Password@1234567',  created_at: new Date(), updated_at: new Date(), deleted: true}
  ]
  private lastId: number = this.users.length

  create(dto: CreateUserDto): IUser {
    const userCreated: IUser = {
      id: this.lastId,
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false,
      ...dto,
    }

    this.users.push(userCreated)
    this.lastId = (this.users.length) + 1
    return userCreated
  }

  findAll(): IUser[] {
    return this.checkIfIsNotDeleted(this.users)
  }

  findById(id: number): IUser {
    const result: IUser | undefined = this.users.find((user: IUser) => user.id == id && user.deleted === false)
    if (result == null) {
      throw new NotFoundException(`Não foi encontrado nenhum usuário com o id: ${id}`)
    }
    return result
  }

  private checkIfIsNotDeleted(users: IUser[]): IUser[] {
    return users.filter( (user: IUser) => user?.deleted === false)
  }


  update(id: number, user: UpdateUserDto): IUser | undefined {
    const userFound: IUser = this.findById(id)
    const index = this.users.findIndex( (user: IUser) => user.id == id)
    const userEdited = { ...userFound, ...user}
    userEdited.updated_at = new Date()
    this.users[index] = userEdited
    return userEdited
  }

  delete(id: number): void {
    const userFound: IUser = this.findById(id)
    const index = this.users.findIndex( (user: IUser) => user.id == id)
    const userDeleted = userFound
    userDeleted.deleted = true
    userDeleted.updated_at = new Date()
    this.users[index] = userDeleted
  }
}
