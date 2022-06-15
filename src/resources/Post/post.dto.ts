import {
  Post,
  PostComment as Comment,
  PostLike as Like,
  User,
} from "@prisma/client"

export class PostDto implements Post {
  userId: string
  id: string
  createdBy: string
  createdOn: Date
  title: string
  body: string
  user: User
  comments: Comment[]
  likes: Like[]
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
