import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"
import {
  IsDefined,
  IsEmail,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator"

export default class User {
  @ApiProperty()
  imageId: string | null
  @ApiProperty()
  id: string
  @ApiProperty()
  firstName: string
  @ApiProperty()
  lastName: string
  @ApiProperty()
  phoneNumber: string
  @ApiProperty()
  email: string
  @ApiProperty()
  password: string
  @ApiProperty()
  bio: string
}
export class UserDto {
  @ApiProperty()
  image?: string
  @ApiProperty()
  id: string
  @ApiProperty()
  firstName: string
  @ApiProperty()
  lastName: string
  @ApiProperty()
  phoneNumber: string
  @ApiProperty()
  email: string
  @ApiProperty()
  password: string
  @ApiProperty()
  bio: string
}

export class RetrieveUserDto extends PartialType(
  OmitType(UserDto, ["image", "password"]),
) {}

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  firstName: string
  @IsString()
  @MinLength(3)
  @ApiProperty()
  lastName: string
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty()
  @IsNumberString()
  phoneNumber: string
  @IsEmail()
  @ApiProperty()
  email: string
  @IsDefined()
  @ApiProperty()
  password: string
  @IsDefined()
  @ApiProperty()
  bio: string
}

export class UserLoginDto {
  @ApiProperty()
  email: string
  @ApiProperty()
  password: string
  @ApiProperty()
  isHashed: boolean
}

export class FollowDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  followerId: string
  @ApiProperty()
  followedId: string
}

export class FollowTransactionDto {
  @ApiProperty()
  @IsDefined()
  followerId: string
  @ApiProperty()
  @IsDefined()
  followedId: string
}
