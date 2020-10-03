import { EmailValidatorAdapter } from './EmailValidatorAdapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  const sut = new EmailValidatorAdapter()
  describe('and is invalid email', () => {
    let isValid: boolean
    beforeAll(() => {
      jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
      isValid = sut.isValid('invalid_email')
    })

    it('should return false', () => {
      expect(isValid).toBe(false)
    })
  })

  describe('and is valid email', () => {
    let isValid: boolean
    beforeAll(() => {
      isValid = sut.isValid('valid_email')
    })

    it('should call with correct email', () => {
      expect(validator.isEmail).toHaveBeenCalledWith('valid_email')
    })

    it('should return true', () => {
      expect(isValid).toBe(true)
    })
  })
})
