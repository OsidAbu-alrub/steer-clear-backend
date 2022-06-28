import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common"
import { Request, Response } from "express"
import BaseResponse from "../global/BaseResponse"

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const statusCode = exception.getStatus()
    const exceptionResponse = exception.getResponse() as any
    console.log(exceptionResponse)
    const responseBody: BaseResponse<{ timestamp: string; path: string }> = {
      validation: {
        message:
          exceptionResponse && typeof exceptionResponse === "string"
            ? exceptionResponse
            : exceptionResponse &&
              typeof exceptionResponse === "object" &&
              "message" in exceptionResponse &&
              exceptionResponse.message instanceof Array
            ? exceptionResponse.message.join(", ")
            : typeof exceptionResponse === "object" &&
              "error" in exceptionResponse
            ? exceptionResponse.error
            : exceptionResponse &&
              typeof exceptionResponse === "object" &&
              "message" in exceptionResponse
            ? exceptionResponse.message
            : "Error occurred",
        statusCode,
      },
      data: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    }

    response.status(statusCode).json(responseBody)
  }
}
