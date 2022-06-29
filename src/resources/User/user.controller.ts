import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { MAX_FILE_SIZE } from "src/global/constants"
import {
  CreateUserDto,
  RetrieveUserDto,
  UserDto,
  UserLoginDto,
} from "./user.dto"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Post("find")
  async findUser(
    @Body() retrieveUser: RetrieveUserDto,
  ): AsyncBaseResponse<UserDto> {
    const user = await this.userService.findUser(retrieveUser)
    return {
      data: user,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Post("register")
  async register(@Body() user: CreateUserDto): AsyncBaseResponse<UserDto> {
    const createdUser = await this.userService.register(user)
    return {
      data: createdUser,
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
    }
  }

  @Post("login")
  async login(
    @Body() userLogin: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): AsyncBaseResponse<UserDto> {
    console.log(userLogin.isHashed)
    const user = await this.userService.login(userLogin, res)
    return {
      data: user,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Post("logout")
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): AsyncBaseResponse<boolean> {
    const isLoggedout = await this.userService.logout(res)
    return {
      data: isLoggedout,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Post("upload-image")
  @UseInterceptors(
    FileInterceptor("image", {
      limits: { fieldSize: MAX_FILE_SIZE },
    }),
  )
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body("userId") userId: string,
  ): AsyncBaseResponse<string> {
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
