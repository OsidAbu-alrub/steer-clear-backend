import { Post, PostLike as Like, PostLike, User } from "@prisma/client"
import { IsDate, IsDefined, IsString } from "class-validator"

type UserWithStringImage = Omit<User, "image"> & { image: string | null }

export class PostDto {
  @IsString()
  userId: string
  @IsString()
  id: string
  @IsDate()
  createdOn: Date
  title: string
  body: string
  isLiked: boolean
  user: UserWithStringImage
  likes?: Like[]
}

export class CreatePostDto {
  @IsString()
  @IsDefined()
  userId: string
  @IsString()
  @IsDefined()
  title: string
  @IsString()
  @IsDefined()
  body: string
}

export class LikeDto {
  userId: string
  postId: string
}

export type PostWithUserAndLikesModel = Post & {
  user: User
  likes: PostLike[]
}
