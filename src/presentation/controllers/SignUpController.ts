import { MissingParamError } from '../Errors/MissingParamError'
import { HttpRequest, HttpResponse } from '../protocols/Http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let error: Error = new Error()

    if (!httpRequest.body.name) {
      error = new MissingParamError('name')
    }

    if (!httpRequest.body.email) {
      error = new MissingParamError('email')
    }

    return {
      statusCode: 400,
      body: error
    }
  }
}
