import { InvalidParamError } from '../Errors/InvalidParamError'
import { MissingParamError } from '../Errors/MissingParamError'
import { EmailValidator } from '../protocols/EmailValidator'
import { HttpRequest, HttpResponse } from '../protocols/Http'
import { SignUpController } from './SignUpController'

export interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  describe('when create user', () => {
    const { sut, emailValidatorStub } = makeSut()
    let httpRequest: HttpRequest
    let httpResponse: HttpResponse

    describe('and name is not provided', () => {
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

    describe('and email is not provided', () => {
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

    describe('and password is not provided', () => {
      beforeAll(() => {
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            passwordConfirmation: 'any_password'
          }
        }
        httpResponse = sut.handle(httpRequest)
      })
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
      })
    })

    describe('and password confirmation is not provided', () => {
      beforeAll(() => {
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password'
          }
        }
        httpResponse = sut.handle(httpRequest)
      })
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
      })
    })

    describe('and email is invalid', () => {
      beforeAll(() => {
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        httpRequest = {
          body: {
            email: 'invalid_email',
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
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
      })
    })
  })
})
