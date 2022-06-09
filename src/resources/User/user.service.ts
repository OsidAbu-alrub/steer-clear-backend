import { HttpStatus, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import UserContract from "./user.contract"
import {
  CreateUserDto,
  RetrieveUserDto,
  UpdateUserDto,
  UserDto,
} from "./user.dto"
import { hashPassword, isValidCreateAttributes } from "./user.utils"

@Injectable()
export class UserService implements UserContract {
  constructor(private readonly prismaService: PrismaService) {}

  retrieve = async (
    retrieveUserDto: RetrieveUserDto = {},
  ): Promise<Array<RetrieveUserDto>> => {
    const userModel = this.fromRetrieveDto(retrieveUserDto)
    const users = await this.prismaService.user.findMany({
      where: {
        email: userModel.email,
        id: userModel.id,
        isAdmin: userModel.isAdmin,
      },
    })
    return users.map(this.fromRetrieveModel)
  }

  create = async (createUserDto: CreateUserDto): Promise<UserDto> => {
    const user = this.fromCreateDto(createUserDto)

    if (!isValidCreateAttributes(createUserDto)) {
      throw new GenericHttpException(
        "email must be valid and is required. Password is required",
        HttpStatus.BAD_REQUEST,
      )
    }

    const emailTaken = Boolean(
      await this.prismaService.user.findUnique({
        where: {
          email: user.email,
        },
      }),
    )

    if (emailTaken) {
      throw new GenericHttpException(
        "email is already taken",
        HttpStatus.BAD_REQUEST,
      )
    }

    user.password = await hashPassword(user.password)

    const createdUser = await this.prismaService.user.create({
      data: user,
    })

    return this.fromModel(createdUser)
  }

  update = async (updateUserDto: UpdateUserDto): Promise<UserDto> => {
    const updatedUserModel = this.fromUpdateDto(updateUserDto)

    if (!updatedUserModel.id) {
      throw new GenericHttpException("id is required", HttpStatus.BAD_REQUEST)
    }

    updatedUserModel.password = updatedUserModel.password
      ? await hashPassword(updatedUserModel.password)
      : updatedUserModel.password

    await this.prismaService.user.findUnique({
      where: {
        id: updatedUserModel.id,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException("user not found", HttpStatus.NOT_FOUND)
      },
    })

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: updatedUserModel.id,
      },
      data: updatedUserModel,
    })

    return this.fromModel(updatedUser)
  }

  delete = async (userId: UserDto["id"]): Promise<UserDto> => {
    await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `user with ID ${userId} not found`,
          HttpStatus.NOT_FOUND,
        )
      },
    })

    const deletedUser = await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    })

    return this.fromModel(deletedUser)
  }

  /************** UTILITY METHODS **************/
  private fromCreateDto = (createUserDto: CreateUserDto): User => {
    return {
      email: createUserDto.email,
      password: createUserDto.password,
      isAdmin: createUserDto.isAdmin,
      id: undefined,
    }
  }
  private fromUpdateDto = (updateUserDto: UpdateUserDto): User => {
    return {
      id: updateUserDto.id,
      email: updateUserDto.email,
      isAdmin: updateUserDto.isAdmin,
      password: updateUserDto.password,
    }
  }
  private fromRetrieveDto = (retrieveUserDto: RetrieveUserDto): User => {
    return {
      email: retrieveUserDto.email,
      id: retrieveUserDto.id,
      isAdmin: retrieveUserDto.isAdmin,
      password: undefined,
    }
  }
  private fromRetrieveModel = (user: User): RetrieveUserDto => {
    return {
      email: user.email,
      id: user.id,
      isAdmin: user.isAdmin,
      password: user.password,
    }
  }
  private fromModel = (user: User): UserDto => {
    return {
      email: user.email,
      id: user.id,
      isAdmin: user.isAdmin,
      password: user.password,
    }
  }
}
