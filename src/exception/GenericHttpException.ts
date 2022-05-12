import { HttpException, HttpStatus } from "@nestjs/common"

// could make this more generic by giving it generic
// parameters. But it is not needed for now
export class GenericHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode)
  }
}
