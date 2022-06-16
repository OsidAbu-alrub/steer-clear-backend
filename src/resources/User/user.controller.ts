import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { CreateUserDto, UserDto, UserLoginDto } from "./user.dto"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  async createUser(@Body() user: CreateUserDto): AsyncBaseResponse<UserDto> {
    const createdUser = await this.userService.createUser(user)
    return {
      data: createdUser,
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
    }
  }

  @Get("all")
  async getAllUsers(): AsyncBaseResponse<UserDto[]> {
    const users = await this.userService.getAllUsers()
    return {
      data: users,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Post("login")
  async login(@Body() userLogin: UserLoginDto): AsyncBaseResponse<UserDto> {
    const user = await this.userService.login(userLogin)

    return {
      data: user,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Post("upload-image")
  @UseInterceptors(
    FileInterceptor("image", {
      limits: { fieldSize: 2 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body("userId") userId: string,
  ): AsyncBaseResponse<string> {
    if (image.size > 2 * 1024 * 1024)
      throw new GenericHttpException("Max size is 2MB", HttpStatus.BAD_REQUEST)

    const isDone = await this.userService.uploadImage(image, userId)
    return {
      data: isDone,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }
}
