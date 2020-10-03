import { UserModel } from '../entities/UserModel'
export interface CreateUser {
  execute: (user: Omit<UserModel, 'id'>) => UserModel

}
