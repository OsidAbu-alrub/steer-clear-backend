import { Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateUserDto, UserDto } from "./user.dto"

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
    const createdUserModel = await this.prismaService.user.create({
      data: {
        ...userModel,
      },
    })
    return this.toUserDto(createdUserModel)
  }
}
