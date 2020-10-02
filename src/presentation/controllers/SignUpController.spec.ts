import { SignUpController } from './SignUpController'

describe('SignUp Controller', () => {
  describe('when create user', () => {
    const sut = new SignUpController()
    const httpRequestDefault = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    describe('and no name is provided', () => {
      let httpResponse
      beforeAll(() => {
        httpResponse = sut.handle(httpRequestDefault)
      })
      it('should return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })
    })
  })
})
