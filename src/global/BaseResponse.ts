import { HttpStatus } from "@nestjs/common"

export default interface BaseResponse<T> {
  data: T | T[]
  validation: ValidationResponse
}

export type ValidationResponse = {
  message: string
  statusCode: HttpStatus
}

export type AsyncBaseResponse<T> = Promise<BaseResponse<T>>
