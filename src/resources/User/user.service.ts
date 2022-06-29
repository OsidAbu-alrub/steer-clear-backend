import { HttpStatus, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/client"
import { Response } from "express"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { MAX_FILE_SIZE } from "src/global/constants"
import { GoogleDriveService } from "src/google-drive/google-drive.service"
import { JwtPayload } from "src/jwt/jwt.strategy"
import { PrismaService } from "src/prisma/prisma.service"
import {
  CreateUserDto,
  RetrieveUserDto,
  UserDto,
  UserLoginDto,
} from "./user.dto"
import { comparePasswords, hashPassword } from "./user.utils"

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async getAllUsers() {
    const users = await this.prismaService.user.findMany()
    return users.map(this.fromModel)
  }

  async findUser(userDto: RetrieveUserDto) {
    const userModel = this.fromRetrieveDto(userDto)

    const user = await this.prismaService.user.findFirst({
      where: {
        email: userModel.email,
        id: userModel.id,
        lastName: userModel.lastName,
        phoneNumber: userModel.phoneNumber,
        firstName: userModel.firstName,
        bio: {
          contains: userModel.bio,
        },
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException("User not found", HttpStatus.NOT_FOUND)
      },
    })
    return this.fromModel(user)
  }

  async register(user: CreateUserDto) {
    const isEmailDuplicate = Boolean(
      await this.prismaService.user.findUnique({
        where: {
          email: user.email,
        },
      }),
    )

    if (isEmailDuplicate)
      throw new GenericHttpException(
        "User with this email already exists",
        HttpStatus.BAD_REQUEST,
      )

    user.password = await hashPassword(user.password)
    const createdUserModel = await this.prismaService.user.create({
      data: user,
    })
    return this.fromModel(createdUserModel)
  }

  login = async (userLogin: UserLoginDto, response: Response) => {
    const userModel = this.fromLoginDto(userLogin)
    const user = await this.prismaService.user.findFirst({
      where: {
        email: {
          equals: userModel.email,
        },
        password: userLogin.isHashed ? userModel.password : undefined,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          "Email/password invalid",
          HttpStatus.NOT_FOUND,
        )
      },
    })

    if (
      !userLogin.isHashed &&
      !(await comparePasswords(userModel.password, user.password))
    )
      throw new GenericHttpException(
        "Email/password invalid",
        HttpStatus.NOT_FOUND,
      )

    const userDto = this.fromModel(user)
    const payload: JwtPayload = {
      email: userDto.email,
      password: userDto.password,
      sub: user.id,
      exp: -1,
      iat: Date.now(),
    }

    const jwtToken = await this.jwtService.signAsync(payload)
    response.cookie(process.env.JWT_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      sameSite: "none",
    })
    response.status(HttpStatus.OK)
    return userDto
  }

  logout = async (response: Response): Promise<boolean> => {
    response.clearCookie(process.env.JWT_COOKIE_NAME)
    response.status(HttpStatus.OK)
    return true
  }

  uploadImage = async (file: Express.Multer.File, userId: string) => {
    if (file.size > MAX_FILE_SIZE)
      throw new GenericHttpException("Max size is 2MB", HttpStatus.BAD_REQUEST)

    const { imageId } = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        imageId: true,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException("User not found", HttpStatus.NOT_FOUND)
      },
    })

    const userImageId = imageId
      ? await this.googleDriveService.updateFile(file, imageId, "user_image")
      : await this.googleDriveService.createFile(file, "user_image")

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        imageId: userImageId,
      },
    })
    return userImageId
  }

  // ************ UTILITY METHODS ************ //
  fromLoginDto = (userLoginDto: UserLoginDto): User => {
    return {
      email: userLoginDto.email,
      password: userLoginDto.password,
      bio: undefined,
      firstName: undefined,
      id: undefined,
      imageId: undefined,
      lastName: undefined,
      phoneNumber: undefined,
    }
  }

  fromRetrieveDto = (userDto: RetrieveUserDto): User => {
    return {
      bio: userDto.bio,
      email: userDto.email,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      phoneNumber: userDto.phoneNumber,
      id: userDto.id,
      imageId: undefined,
      password: undefined,
    }
  }

  fromModel(user: User): UserDto {
    return {
      bio: user.bio,
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      password: user.password,
      image: user.imageId
        ? this.googleDriveService.getPublicViewURL(user.imageId)
        : null,
    }
  }
}
