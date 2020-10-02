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
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new Error('Missing param: name'))
      })
    })
  })
})
