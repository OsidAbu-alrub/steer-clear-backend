import { PostComment as Comment, PostLike as Like, User } from "@prisma/client"

export interface PostDto {
  id: string
  createdBy: string
  createdOn: Date
  title: string
  body: string
  comments?: Comment[]
  likes?: Like[]
}

export type CreatePostDto = {
  id?: string
  createdBy: string
  createdOn?: Date
  title: string
  body: string
}

export type PostFeedDto = PostDto & {
  user: Omit<User, "password">
}
