import { User as UserModel } from "@prisma/client"

export default class User implements UserModel {
  image: Buffer
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  bio: string
}
export class UserDto {
  image?: string
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  bio: string
}

export class CreateUserDto {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  bio: string
}

export class UserLoginDto {
  email: string
  password: string
}
