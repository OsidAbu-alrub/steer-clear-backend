import { PartialType } from "@nestjs/swagger"
import { PostComment, User } from "@prisma/client"
import { IsDefined, IsString } from "class-validator"

type UserWithStringImage = Omit<User, "image"> & { image: string | null }

export class CommentDto {
  id: string
  userId: string
  postId: string
  body: string
  createdOn: Date
  user: UserWithStringImage
}

export class RetrieveCommentDto extends PartialType(CommentDto) {}

export class CreateCommentDto {
  @IsDefined()
  @IsString()
  userId: string
  @IsDefined()
  @IsString()
  postId: string
  @IsDefined()
  @IsString()
  body: string
}

export type CommentWithUserModel = PostComment & {
  user: User
}
