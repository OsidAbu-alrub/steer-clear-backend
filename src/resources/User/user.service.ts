import { HttpStatus, Injectable } from "@nestjs/common"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { toBase64String } from "src/global/utils"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateUserDto, UserLoginDto } from "./user.dto"

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto) {
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
    return {
      ...createdUserModel,
      image: null,
    }
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany()
    return users.map((user) => ({ ...user, image: toBase64String(user.image) }))
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

    return { ...user, image: toBase64String(user.image) }
  }

  uploadImage = async (file: Express.Multer.File, userId: string) => {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        image: file.buffer,
      },
    })

    return "Image uploaded successfully"
  }
}
