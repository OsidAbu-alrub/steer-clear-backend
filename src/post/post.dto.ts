import { PostComment as Comment, PostLike as Like } from "@prisma/client"

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
