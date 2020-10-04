import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
}));

describe('Bcrypt Adapter', () => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  describe('and promises resolves', () => {
    let hash: string;
    beforeAll(async () => {
      hash = await sut.encrypt('any_value');
    });

    it('should call with correct values', () => {
      expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
    });

    it('should return a hash on success', () => {
      expect(hash).toBe('hashed_value');
    });
  });
});
