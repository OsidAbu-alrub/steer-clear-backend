import { ApiProperty } from "@nestjs/swagger"
import { PostLike as Like, PostLike, User } from "@prisma/client"
import { IsDate, IsDefined, IsString } from "class-validator"
import { UserDto } from "../User/user.dto"

export class PostDto {
  @IsString()
  @ApiProperty()
  userId: string
  @IsString()
  @ApiProperty()
  id: string
  @IsDate()
  @ApiProperty()
  createdOn: Date
  @ApiProperty()
  title: string
  @ApiProperty()
  body: string
  @ApiProperty()
  isLiked: boolean
  @ApiProperty()
  user: UserDto
  @ApiProperty()
  likes?: Like[]
}

export class CreatePostDto {
  @IsString()
  @IsDefined()
  @ApiProperty()
  userId: string
  @IsString()
  @IsDefined()
  @ApiProperty()
  title: string
  @IsString()
  @IsDefined()
  @ApiProperty()
  body: string
}

export class LikeDto {
  @ApiProperty()
  userId: string
  @ApiProperty()
  postId: string
}

export class PostWithUserAndLikesModel {
  @ApiProperty()
  id: string
  @ApiProperty()
  userId: string
  @ApiProperty()
  title: string
  @ApiProperty()
  body: string
  @ApiProperty()
  createdOn: Date
  @ApiProperty()
  user: User
  @ApiProperty()
  likes: PostLike[]
}
