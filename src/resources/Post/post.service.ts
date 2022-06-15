import { Injectable } from "@nestjs/common"
import { Post, User } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreatePostDto, PostDto, PostFeedDto } from "./post.dto"

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  toModel({
    body,
    createdBy,
    createdOn,
    id,
    title,
  }: PostDto | CreatePostDto): Post {
    return {
      body,
      createdOn,
      userId: createdBy,
      id,
      title,
    }
  }

  toPostDto({ body, createdOn, id, title, userId }: Post): PostDto {
    return {
      body,
      createdOn,
      createdBy: userId,
      id,
      title,
      comments: [],
      likes: [],
      user: undefined,
      userId: undefined,
    }
  }

  toCreatePostDto({ body, createdOn, id, title, userId }: Post): CreatePostDto {
    return {
      body,
      createdOn,
      createdBy: userId,
      id,
      title,
    }
  }

  toPostFeedDto = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user,
    ...post
  }: Post & {
    user: User
  }): PostFeedDto => {
    const postDto = this.toPostDto(post)
    return {
      ...postDto,
      user,
    }
  }

  async createPost(post: CreatePostDto) {
    const postModel = this.toModel(post)
    const createdPost = await this.prismaService.post.create({
      data: {
        ...postModel,
      },
    })
    return this.toPostDto(createdPost)
  }

  async getFeed(userId: string) {
    const postsWithUsers = await this.prismaService.post.findMany({
      where: {
        NOT: {
          userId: {
            equals: userId,
          },
        },
      },
      include: {
        user: true,
      },
    })
    return postsWithUsers.map(this.toPostFeedDto)
  }
}
