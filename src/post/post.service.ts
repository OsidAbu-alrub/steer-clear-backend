import { Injectable } from "@nestjs/common"
import { Post } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreatePostDto, PostDto } from "./post.dto"

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

  async createPost(post: CreatePostDto) {
    const postModel = this.toModel(post)
    const createdPost = await this.prismaService.post.create({
      data: {
        ...postModel,
      },
    })
    return this.toPostDto(createdPost)
  }
}
