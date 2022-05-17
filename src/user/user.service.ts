import { HttpStatus, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateUserDto, UserDto, UserLoginDto } from "./user.dto"

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  private toUserModel(dto: CreateUserDto | UserDto): User {
    return {
      ...dto,
      id: dto.id || undefined,
    }
  }

  private toCreateUserDto(model: User): CreateUserDto {
    return {
      ...model,
    }
  }

  private toUserDto(model: User): UserDto {
    return {
      ...model,
    }
  }

  async createUser(user: CreateUserDto) {
    const userModel = this.toUserModel(user)

    const isUserCreated = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    })

    if (isUserCreated) {
      throw new GenericHttpException(
        "User with this email already exists",
        HttpStatus.BAD_REQUEST,
      )
    }
    const createdUserModel = await this.prismaService.user.create({
      data: {
        ...userModel,
      },
    })
    return this.toUserDto(createdUserModel)
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany()
    return users.map(this.toUserDto)
  }

  async login(userLogin: UserLoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        AND: {
          email: {
            equals: userLogin.email,
          },
          password: {
            equals: userLogin.password,
          },
        },
      },
    })

    if (!user) {
      throw new GenericHttpException(
        "Email/password invalid",
        HttpStatus.NOT_FOUND,
      )
    }

    return this.toUserDto(user)
  }
}
