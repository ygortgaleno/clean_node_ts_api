import { Encrypter } from '../protocols/encrypter'
import { CreateUserAdapterDb } from './CreateUserAdapterDb'

interface SutTypes {
  sut: CreateUserAdapterDb
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (_value: string): Promise<string> {
      return 'hashed_password'
    }
  }

  return new EncryptStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new CreateUserAdapterDb(encrypterStub)

  return {
    sut, encrypterStub
  }
}

describe('CreateUserAdapter interactor', () => {
  const { sut, encrypterStub } = makeSut()
  const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
  const userData = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
  describe('and calls encrypter', () => {
    beforeAll(async () => {
      await sut.execute(userData)
    })
    it('should call with correct password', () => {
      expect(encryptSpy).toHaveBeenCalledWith(userData.password)
    })
  })
})
