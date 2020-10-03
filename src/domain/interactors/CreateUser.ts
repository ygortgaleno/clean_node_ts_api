import { User } from '../entities/User'
export interface CreateUser {
  execute: (user: Omit<User, 'id'>) => Promise<User>

}
