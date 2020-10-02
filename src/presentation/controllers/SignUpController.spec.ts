import { MissingParamError } from '../Errors/MissingParamError'
import { HttpRequest, HttpResponse } from '../protocols/Http'
import { SignUpController } from './SignUpController'

describe('SignUp Controller', () => {
  describe('when create user', () => {
    const sut = new SignUpController()
    let httpRequest: HttpRequest
    let httpResponse: HttpResponse

    describe('and no name is provided', () => {
      beforeAll(() => {
        httpRequest = {
          body: {
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'any_password'
          }
        }
        httpResponse = sut.handle(httpRequest)
      })
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
      })
    })

    describe('and no email is provided', () => {
      beforeAll(() => {
        httpRequest = {
          body: {
            name: 'any_name',
            password: 'any_password',
            passwordConfirmation: 'any_password'
          }
        }
        httpResponse = sut.handle(httpRequest)
      })
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
      })
    })
  })
})
