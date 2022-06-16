import { Injectable } from "@nestjs/common"
import { Post } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateCommentDto, CreatePostDto, LikeDto, PostDto } from "./post.dto"

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
      isLiked: false,
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

  async getFeed(userId: string) {
    const posts = await this.prismaService.post.findMany({
      where: {
        NOT: {
          userId: {
            equals: userId,
          },
        },
      },
      include: {
        user: true,
        categories: true,
        comments: true,
        likes: true,
      },
    })

    const userLikedPosts = (
      await this.prismaService.postLike.findMany({
        where: {
          userId,
        },
        select: {
          postId: true,
        },
      })
    )
      .map(({ postId }) => postId)
      .reduce<Set<string>>((acc, postId) => {
        acc.add(postId)
        return acc
      }, new Set<string>())

    const postsWithUserLikes = posts.map((post) => {
      const isLiked = userLikedPosts.has(post.id)
      return {
        ...post,
        isLiked,
      }
    })

    return postsWithUserLikes
  }

  createComment = async (createCommentDto: CreateCommentDto) => {
    const createdComment = await this.prismaService.postComment.create({
      data: createCommentDto,
    })
    return createdComment
  }

  findPost = async (postId: string, userId: string) => {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        categories: true,
        comments: true,
        likes: true,
      },
    })

    const isPostLikedByUser = await this.prismaService.postLike.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    })

    return { ...post, isLiked: Boolean(isPostLikedByUser) }
  }

  likePost = async ({ postId, userId }: LikeDto) => {
    const isPostLikedByUser = Boolean(
      await this.prismaService.postLike.findUnique({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      }),
    )

    if (isPostLikedByUser) {
      await this.prismaService.postLike.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      })
    } else {
      await this.prismaService.postLike.create({
        data: {
          postId,
          userId,
        },
      })
    }

    return true
  }
}
