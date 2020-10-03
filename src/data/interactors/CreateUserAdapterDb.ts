import { User } from '../../domain/entities/User'
import { CreateUser } from '../../domain/interactors/CreateUser'
import { Encrypter } from '../protocols/encrypter'

export class CreateUserAdapterDb implements CreateUser {
  constructor (private readonly encrypter: Encrypter) {}

  async execute (userData: Omit<User, 'id'>): Promise<User> {
    await this.encrypter.encrypt(userData.password)
    return {
      id: 'valid_id',
      ...userData
    }
  }
}
