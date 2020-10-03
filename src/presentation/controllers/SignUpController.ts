import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helper/HttpHelper'
import { Controller } from '../protocols/Controller'
import { EmailValidator } from '../protocols/EmailValidator'
import { HttpRequest, HttpResponse } from '../protocols/Http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!Object.keys(httpRequest.body).includes(field)) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return { statusCode: 200, body: 'ok' }
    } catch (error) {
      return serverError()
    }
  }
}
