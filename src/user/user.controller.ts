import { Body, Controller, HttpStatus, Post } from "@nestjs/common"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { CreateUserDto, UserDto } from "./user.dto"
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
}
