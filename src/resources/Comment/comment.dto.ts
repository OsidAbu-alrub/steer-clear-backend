import { ApiProperty, PartialType } from "@nestjs/swagger"
import { User } from "@prisma/client"
import { IsDefined, IsString } from "class-validator"
import { UserDto } from "../User/user.dto"

export class CommentDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  userId: string
  @ApiProperty()
  postId: string
  @ApiProperty()
  body: string
  @ApiProperty()
  createdOn: Date
  @ApiProperty()
  user: UserDto
}

export class RetrieveCommentDto extends PartialType(CommentDto) {}

export class CreateCommentDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  userId: string
  @IsDefined()
  @IsString()
  @ApiProperty()
  postId: string
  @IsDefined()
  @IsString()
  @ApiProperty()
  body: string
}

export class CommentWithUserModel {
  @ApiProperty()
  id: string
  @ApiProperty()
  userId: string
  @ApiProperty()
  postId: string
  @ApiProperty()
  body: string
  @ApiProperty()
  createdOn: Date
  @ApiProperty()
  user: User
}
