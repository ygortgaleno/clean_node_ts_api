import { User } from '../../domain/entities/User';
import { Encrypter } from '../protocols/encrypter';
import { CreateUserRepository } from '../repositories/CreateUserRepository';
import { CreateUserAdapterDb } from './CreateUserAdapterDb';

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt(): Promise<string> {
      return 'hashed_password';
    }
  }

  return new EncryptStub();
};

const makeCreateUserRepository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async execute(data: Omit<User, 'id'>): Promise<User> {
      return {
        ...data,
        id: 'valid_id',
        password: 'hashed_password',
      };
    }
  }

  return new CreateUserRepositoryStub();
};

interface SutTypes {
  sut: CreateUserAdapterDb
  encrypterStub: Encrypter
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const createUserRepositoryStub = makeCreateUserRepository();
  const sut = new CreateUserAdapterDb(encrypterStub, createUserRepositoryStub);

  return {
    sut, encrypterStub, createUserRepositoryStub,
  };
};

describe('CreateUserAdapter interactor', () => {
  const { sut, encrypterStub, createUserRepositoryStub } = makeSut();
  const userData = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
  };
  describe('and calls encrypter', () => {
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');
    beforeAll(async () => {
      await sut.execute(userData);
    });
    it('should call with correct password', () => {
      expect(encrypterSpy).toHaveBeenCalledWith(userData.password);
    });
  });

  describe('and encrypter throws', () => {
    beforeAll(() => {
      jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());
    });

    it('should throw error', async () => {
      await expect(sut.execute(userData)).rejects.toThrow();
    });
  });

  describe('and calls CreateUserRepository', () => {
    const createUserRepositorySpy = jest.spyOn(createUserRepositoryStub, 'execute');
    beforeAll(async () => {
      await sut.execute(userData);
    });

    it('should call createUserRepository with correct values', () => {
      expect(createUserRepositorySpy)
        .toHaveBeenCalledWith({ ...userData, password: 'hashed_password' });
    });
  });
});
