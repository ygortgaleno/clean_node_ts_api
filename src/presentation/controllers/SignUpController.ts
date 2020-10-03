import { MissingParamError } from '../Errors/MissingParamError'
import { badRequest } from '../Helper/HttpHelper'
import { Controller } from '../protocols/Controller'
import { HttpRequest, HttpResponse } from '../protocols/Http'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']

    for (const field of requiredFields) {
      if (!Object.keys(httpRequest.body).includes(field)) {
        return badRequest(new MissingParamError(field))
      }
    }

    return { statusCode: 200, body: 'ok' }
  }
}
