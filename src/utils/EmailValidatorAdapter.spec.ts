import validator from 'validator';
import { EmailValidatorAdapter } from './EmailValidatorAdapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

describe('EmailValidator Adapter', () => {
  const sut = makeSut();
  describe('and is invalid email', () => {
    let isValid: boolean;

    beforeAll(() => {
      jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
      isValid = sut.isValid('invalid_email');
    });

    it('should return false', () => {
      expect(isValid).toBe(false);
    });
  });

  describe('and is valid email', () => {
    let isValid: boolean;

    beforeAll(() => {
      isValid = sut.isValid('valid_email');
    });

    it('should call with correct email', () => {
      expect(validator.isEmail).toHaveBeenCalledWith('valid_email');
    });

    it('should return true', () => {
      expect(isValid).toBe(true);
    });
  });
});
