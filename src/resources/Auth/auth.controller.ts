import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { LoginAuthDto, RegisterAuthDto } from "./auth.dto"
import { AuthService } from "./auth.service"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login into system
   * @param authDto - credintials to login
   * @returns boolean - if login was successful
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Login successful",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid credentials",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid credentials",
  })
  @Post("login")
  async login(
    @Body() authDto: LoginAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): AsyncBaseResponse<boolean> {
    const loggedIn = await this.authService.login(authDto, response)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: loggedIn,
    }
  }

  /**
   * Register into system
   *
   * @param authDto - credintials to register
   * @returns boolean - if registration was successful
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Account created successfully",
  })
  @Post("register")
  async register(
    @Body() authDto: RegisterAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): AsyncBaseResponse<boolean> {
    const loggedIn = await this.authService.register(authDto, response)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: loggedIn,
    }
  }

  /**
   * Logout from system
   *
   * @returns boolean - if logout was successful
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Logout successful",
  })
  @Post("logout")
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): AsyncBaseResponse<boolean> {
    const loggedOut = await this.authService.logout(response)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: loggedOut,
    }
  }
}
