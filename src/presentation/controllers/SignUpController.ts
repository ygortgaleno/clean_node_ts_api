import { HttpRequest, HttpResponse } from '../protocols/Http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let error: Error = new Error()

    if (!httpRequest.body.name) {
      error = new Error('Missing param: name')
    }

    if (!httpRequest.body.email) {
      error = new Error('Missing param: email')
    }

    return {
      statusCode: 400,
      body: error
    }
  }
}
