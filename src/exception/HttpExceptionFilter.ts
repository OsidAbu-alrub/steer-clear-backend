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
    const exceptionResponse = exception.getResponse()
    console.log(exceptionResponse)
    const responseBody: BaseResponse<{ timestamp: string; path: string }> = {
      validation: {
        message:
          exceptionResponse && typeof exceptionResponse === "string"
            ? (exceptionResponse as string)
            : typeof exceptionResponse === "object" &&
              "error" in exceptionResponse
            ? (exceptionResponse as any).error
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
