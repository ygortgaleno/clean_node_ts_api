import { User } from '../../domain/entities/User';

export interface CreateUserRepository {
  execute: (data: Omit<User, 'id'>) => Promise<User>
}
