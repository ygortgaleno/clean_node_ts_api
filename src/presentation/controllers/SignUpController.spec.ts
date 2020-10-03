import { UserModel } from '../../domain/entities/UserModel'
import { CreateUser } from '../../domain/interactors/CreateUser'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { HttpRequest, HttpResponse } from '../protocols/Http'
import { EmailValidator } from '../validators/EmailValidator'
import { SignUpController } from './SignUpController'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeCreateUser = (): CreateUser => {
  class CreateUserUseCaseStub implements CreateUser {
    execute (_user: Omit<UserModel, 'id'>): UserModel {
      const fakeUser: UserModel = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return fakeUser
    }
  }

  return new CreateUserUseCaseStub()
}

export interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  createUserStub: CreateUser
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const createUserStub = makeCreateUser()
  const sut = new SignUpController(emailValidatorStub, createUserStub)

  return {
    sut,
    emailValidatorStub,
    createUserStub
  }
}

describe('SignUp Controller', () => {
  describe('when create user', () => {
    const { sut, emailValidatorStub, createUserStub } = makeSut()
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

    describe('and password confirmation fails', () => {
      beforeAll(() => {
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'invalid_password_confirmation'
          }
        }
        httpResponse = sut.handle(httpRequest)
      })
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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

      it('should call EmailValidator with correct email', () => {
        expect(emailValidatorStub.isValid).toHaveBeenCalledWith('invalid_email')
      })

      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
      })
    })

    describe('and EmailValidator throws', () => {
      beforeAll(() => {
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
          throw new Error()
        })
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'any_password'
          }
        }
        httpResponse = sut.handle(httpRequest)
      })
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(500)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new ServerError())
      })
    })

    describe('and call CreateUser', () => {
      beforeAll(() => {
        jest.spyOn(createUserStub, 'execute')
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

      it('should call EmailValidator with correct email', () => {
        expect(createUserStub.execute).toHaveBeenCalledWith({
          email: 'invalid_email',
          name: 'any_name',
          password: 'any_password'
        })
      })
    })

    describe('and CreateUser throws', () => {
      beforeAll(() => {
        jest.spyOn(createUserStub, 'execute').mockImplementationOnce(() => {
          throw new Error()
        })
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'any_password'
          }
        }
        httpResponse = sut.handle(httpRequest)
      })
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(500)
      })

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new ServerError())
      })
    })
  })
})
