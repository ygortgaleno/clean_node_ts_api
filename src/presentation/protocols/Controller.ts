import { HttpRequest, HttpResponse } from './Http'

export interface Controller {
  handle: (request: HttpRequest) => HttpResponse
}
