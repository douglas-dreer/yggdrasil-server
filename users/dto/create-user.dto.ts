import { IUser } from '../interface/user.interface';

export class CreateUserDto implements IUser {
  email: string;
  password: string;
}
