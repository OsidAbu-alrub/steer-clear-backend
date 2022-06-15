import { HttpStatus, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Response } from "express"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { JwtPayload } from "src/jwt/jwt.strategy"
import { CustomerService } from "../Customer/customer.service"
import { UserService } from "../User/user.service"
import AuthContract from "./auth.contract"
import { LoginAuthDto, RegisterAuthDto } from "./auth.dto"
import { comparePasswords } from "./auth.utils"

@Injectable()
export class AuthService implements AuthContract {
  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  login = async (
    { email, password }: LoginAuthDto,
    response: Response,
  ): Promise<boolean> => {
    const user = (
      await this.userService.retrieve({
        email,
      })
    )[0]

    if (!user) {
      throw new GenericHttpException(
        "Invalid credentials",
        HttpStatus.BAD_REQUEST,
      )
    }

    if (!(await comparePasswords(password, user.password))) {
      throw new GenericHttpException(
        "Invalid credentials",
        HttpStatus.BAD_REQUEST,
      )
    }

    const payload: JwtPayload = {
      email: user.email,
      isAdmin: user.isAdmin,
      sub: user.id,
    }

    const jwt = await this.jwtService.signAsync(payload)

    response.cookie(process.env.JWT_COOKIE_NAME, jwt, {
      // make cookie available for backend only
      httpOnly: true,
    })
    response.status(HttpStatus.OK)

    return true
  }

  register = async (
    {
      email,
      password,
      isAdmin,
      dateOfBirth,
      firstName,
      lastName,
    }: RegisterAuthDto,
    response: Response,
  ): Promise<boolean> => {
    const user = await this.userService.create({
      email,
      password,
      isAdmin,
    })
    await this.customerService.create({
      userId: user.id,
      dateOfBirth,
      firstName,
      lastName,
    })

    const payload: JwtPayload = {
      email: user.email,
      isAdmin: user.isAdmin,
      sub: user.id,
    }

    const jwt = await this.jwtService.signAsync(payload)

    response.cookie(process.env.JWT_COOKIE_NAME, jwt, {
      // make cookie available for backend only
      httpOnly: true,
    })
    response.status(HttpStatus.CREATED)

    return true
  }

  logout = async (response: Response): Promise<boolean> => {
    response.clearCookie("jwt")
    response.status(HttpStatus.OK)
    return true
  }
}
