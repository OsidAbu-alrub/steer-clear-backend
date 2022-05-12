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

    console.log(exception.getResponse())

    const responseBody: BaseResponse<{ timestamp: string; path: string }> = {
      validation: {
        message:
          exception.getResponse() && typeof exception.getResponse() === "string"
            ? (exception.getResponse() as string)
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
