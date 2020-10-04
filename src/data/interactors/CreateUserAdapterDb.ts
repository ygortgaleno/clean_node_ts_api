import { User } from '../../domain/entities/User';
import { CreateUser } from '../../domain/interactors/CreateUser';
import { Encrypter } from '../protocols/encrypter';
import { CreateUserRepository } from '../repositories/CreateUserRepository';

export class CreateUserAdapterDb implements CreateUser {
  private readonly encrypter: Encrypter

  private readonly createUserRepository: CreateUserRepository

  constructor(encrypter: Encrypter, createUserRepository: CreateUserRepository) {
    this.encrypter = encrypter;
    this.createUserRepository = createUserRepository;
  }

  async execute(userData: Omit<User, 'id'>): Promise<User> {
    const hashedPassword = await this.encrypter.encrypt(userData.password);
    return this.createUserRepository.execute({ ...userData, password: hashedPassword });
  }
}
