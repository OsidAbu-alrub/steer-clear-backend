import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common"
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import {
  CreateUserDto,
  RetrieveUserDto,
  UpdateUserDto,
  UserDto,
} from "./user.dto"
import { UserService } from "./user.service"

@UseGuards(JwtAuthGuard)
@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get User objects from database
   * @param retrieveUserDto - object that the retrieval query is based on
   * @returns arrayOfUser - Get User objects from the database
   */
  @ApiBody({ type: RetrieveUserDto, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveUserDto: RetrieveUserDto,
  ): AsyncBaseResponse<Array<RetrieveUserDto>> {
    const arrayOfUser = await this.userService.retrieve(retrieveUserDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfUser,
    }
  }

  /**
   * creates a User and stores it in the database
   *
   * @param createUserDto - User to be created
   * @returns createdUser - the UserDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Email and/or password are missing",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Email taken",
  })
  @Post("create")
  async create(
    @Body() createUserDto: CreateUserDto,
  ): AsyncBaseResponse<UserDto> {
    const createdUser = await this.userService.create(createUserDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdUser,
    }
  }

  /**
   * update existing User
   *
   * @param updatedUserDto - User with updated attributes
   * @returns updatedUser - the updated User
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User ID is required and must be a number",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @Put("update")
  async update(
    @Body() updatedUserDto: UpdateUserDto,
  ): AsyncBaseResponse<UserDto> {
    const updatedUser = await this.userService.update(updatedUserDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: updatedUser,
    }
  }

  /**
   * delete User from database
   *
   * @param userId - the User to be deleted
   * @returns deletedUser - the deleted User
   */
  @ApiParam({ name: "userId", required: true, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "userId is required and must be a number",
  })
  @Delete(":userId")
  async delete(
    @Param(
      "userId",
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new GenericHttpException(
            "userId is required and must be a number",
            HttpStatus.BAD_REQUEST,
          )
        },
      }),
    )
    userId: UserDto["id"],
  ): AsyncBaseResponse<UserDto> {
    const deletedUser = await this.userService.delete(userId)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: deletedUser,
    }
  }
}
