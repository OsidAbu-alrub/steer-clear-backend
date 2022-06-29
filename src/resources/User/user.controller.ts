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
import { ApiResponse } from "@nestjs/swagger"
import { Response } from "express"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { MAX_FILE_SIZE } from "src/global/constants"
import {
  CreateUserDto,
  FollowDto,
  FollowTransactionDto,
  RetrieveUserDto,
  UserDto,
  UserLoginDto,
} from "./user.dto"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all user objects from database
   * @returns arrayOfUsers - users from database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Users retrieved successfully",
  })
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

  /**
   * Get first user object that matches query from database
   * @param retrieveUser - object that the retrieval query is based on
   * @returns user - user from database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
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

  /**
   * Create new user
   * @param user - user object to create
   * @returns createdUser - the newly created user
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Users created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Duplicate email",
  })
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

  /**
   * Login user
   * @param userLogin - user object to login
   * @returns loggedInUser - the user that logged in
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Email/password invalid",
  })
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

  /**
   * Login user
   * @returns isLoggedOut - boolean flag to indicate if user is logged out
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged out successfully",
  })
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

  /**
   * Login user
   * @param image - uploaded image
   * @param userId - user id
   * @returns isDone - done uploading image
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Image uploaded successfully",
  })
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

  /**
   * Follow user
   * @param followTransactionDto - follow transaction object
   * @returns followedUserDto - follow object
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User (follower) follows (followed) successfully",
  })
  @Post("follow")
  async follow(
    @Body() followTransactionDto: FollowTransactionDto,
  ): AsyncBaseResponse<FollowDto> {
    const followedUserDto = await this.userService.follow(followTransactionDto)
    return {
      data: followedUserDto,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  /**
   * Unfollow user
   * @param unfollowTransactionDto - follow transaction object
   * @returns unfollowedUserDto - unfollow object
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User (follower) unfollows (followed) successfully",
  })
  @Post("unfollow")
  async unfollow(
    @Body() unfollowTransactionDto: FollowTransactionDto,
  ): AsyncBaseResponse<FollowDto> {
    const unfollowedUserDto = await this.userService.unfollow(
      unfollowTransactionDto,
    )
    return {
      data: unfollowedUserDto,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  /**
   * Unfollow user
   * @param followTransactionDto - follow transaction object
   * @returns isFollowing - Check if user follows user or not
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Check if user follows user or not",
  })
  @Post("is-following")
  async getIsFollowing(
    @Body() followTransactionDto: FollowTransactionDto,
  ): AsyncBaseResponse<boolean> {
    const isFollowing = await this.userService.followStatus(
      followTransactionDto,
    )
    return {
      data: isFollowing,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }
}
