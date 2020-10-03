import { EmailValidatorAdapter } from './EmailValidatorAdapter'

describe('EmailValidator Adapter', () => {
  const sut = new EmailValidatorAdapter()
  describe('and lib validator returns false', () => {
    let isValid: boolean
    beforeAll(() => {
      isValid = sut.isValid('invalid_email')
    })

    it('should return false', () => {
      expect(isValid).toBe(false)
    })
  })
})
