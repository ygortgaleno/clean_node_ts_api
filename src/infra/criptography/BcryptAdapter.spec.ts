import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

describe('Bcrypt Adapter', () => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  describe('and promises resolves', () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    beforeAll(async () => {
      await sut.encrypt('any_value');
    });
    it('should call with correct values', () => {
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });
  });
});
