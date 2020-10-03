import { CreateUser } from '../../domain/interactors/CreateUser'
import { Encrypter } from '../protocols/encrypter'
import { CreateUserAdapterDb } from './CreateUserAdapterDb'

class EncryptStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return 'hashed_password'
  }
}
describe('CreateUserAdapter interactor', () => {
  const encrypterStub = new EncryptStub()
  const sut: CreateUser = new CreateUserAdapterDb(encrypterStub)
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
