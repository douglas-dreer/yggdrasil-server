export interface IUser {
  id?: number;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted?: boolean;
}
