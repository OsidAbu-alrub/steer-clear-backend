import {
  Post,
  PostCategory as Category,
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
  isLiked: boolean
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

export class PostFeedDto {
  isLiked: boolean
  id: string
  userId: string
  title: string
  body: string
  createdOn: Date
  user: User
  comments: Comment[]
  categories: Category
  likes: Like[]
}

export class CreateCommentDto {
  userId: string
  postId: string
  body: string
}

export class LikeDto {
  userId: string
  postId: string
}
