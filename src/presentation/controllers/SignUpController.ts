import { CreateUser } from '../../domain/interactors/CreateUser'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError, successRequest } from '../helper/HttpHelper'
import { Controller } from '../protocols/Controller'
import { HttpRequest, HttpResponse } from '../protocols/Http'
import { EmailValidator } from '../validators/EmailValidator'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly createUser: CreateUser

  constructor (emailValidator: EmailValidator, createUser: CreateUser) {
    this.emailValidator = emailValidator
    this.createUser = createUser
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!Object.keys(httpRequest.body).includes(field)) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const user = await this.createUser.execute({
        name,
        email,
        password
      })

      return successRequest(user)
    } catch (error) {
      return serverError()
    }
  }
}
