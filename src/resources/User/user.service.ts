import { createMap, Mapper, MappingProfile } from "@automapper/core"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { HttpStatus, Injectable } from "@nestjs/common"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import User, { CreateUserDto, UserDto, UserLoginDto } from "./user.dto"

@Injectable()
export class UserService extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
    private readonly prismaService: PrismaService,
  ) {
    super(mapper)
  }

  async createUser(user: CreateUserDto) {
    console.log(this.mapper.map(user, CreateUserDto, User))
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
        ...user,
      },
    })
    return createdUserModel
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany()
    return users
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

    return user
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, User, CreateUserDto)
      createMap(mapper, User, UserDto)
    }
  }
}
