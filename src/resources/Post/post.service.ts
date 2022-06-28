import { Injectable } from "@nestjs/common"
import { Post } from "@prisma/client"
import { GoogleDriveService } from "src/google-drive/google-drive.service"
import { PrismaService } from "src/prisma/prisma.service"
import {
  CreatePostDto,
  LikeDto,
  PostDto,
  PostWithUserAndLikesModel,
} from "./post.dto"

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}
  async createPost(post: CreatePostDto): Promise<PostDto> {
    const postModel = this.fromCreatePostDto(post)
    const createdPost = await this.prismaService.post.create({
      data: postModel,
    })
    return this.fromModel(createdPost)
  }

  getUserPosts = async (userId: string, postUserId = "") => {
    const userPosts = await this.prismaService.post.findMany({
      where: {
        userId: postUserId || userId,
      },
      include: {
        user: true,
        likes: true,
      },
      orderBy: {
        createdOn: "desc",
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

    const userPostsWithLikes = userPosts.map((post) => {
      const isLiked = userLikedPosts.has(post.id)
      const postDto = this.fromPostWithUserAndLikesModel(post)
      postDto.isLiked = isLiked
      return postDto
    })

    return userPostsWithLikes
  }

  async getFeed(userId: string): Promise<PostDto[]> {
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
      const postDto = this.fromPostWithUserAndLikesModel(post)
      postDto.isLiked = isLiked
      return postDto
    })

    const randomizedFeed = this.randomizeFeed(postsWithUserLikes)
    return randomizedFeed
  }

  findPost = async (postId: string, userId: string): Promise<PostDto> => {
    const post: PostWithUserAndLikesModel =
      await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          user: true,
          likes: true,
        },
      })

    const isPostLikedByUser = await this.prismaService.postLike.findFirst({
      where: {
        userId,
        postId,
      },
    })

    const postDto = this.fromPostWithUserAndLikesModel(post)
    postDto.isLiked = Boolean(isPostLikedByUser)
    return postDto
  }

  likePost = async ({ postId, userId }: LikeDto) => {
    const likedPost = await this.prismaService.postLike.findFirst({
      where: {
        userId,
        postId,
      },
    })

    if (likedPost) {
      await this.prismaService.postLike.delete({
        where: {
          id: likedPost.id,
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

  // ************** UTILITY METHODS ************** //
  randomizeFeed = (feed: PostDto[]) => {
    let currentIndex = feed.length,
      randomIndex: number

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[feed[currentIndex], feed[randomIndex]] = [
        feed[randomIndex],
        feed[currentIndex],
      ]
    }

    return feed
  }

  fromDto({ body, userId, createdOn, id, title }: PostDto): Post {
    return {
      body,
      createdOn,
      userId,
      id,
      title,
    }
  }

  fromModel({ body, createdOn, id, title, userId }: Post): PostDto {
    return {
      body,
      createdOn,
      id,
      title,
      userId,
      likes: [],
      user: undefined,
      isLiked: false,
    }
  }

  fromCreatePostDto({ body, title, userId }: CreatePostDto): Post {
    return {
      body,
      title,
      userId,
      createdOn: new Date(),
      id: undefined,
    }
  }

  fromPostWithUserAndLikesModel = (
    postWithUserAndLikesModel: PostWithUserAndLikesModel,
  ): PostDto => {
    return {
      body: postWithUserAndLikesModel.body,
      createdOn: postWithUserAndLikesModel.createdOn,
      id: postWithUserAndLikesModel.id,
      title: postWithUserAndLikesModel.title,
      userId: postWithUserAndLikesModel.user.id,
      likes: postWithUserAndLikesModel.likes,
      user: {
        image: postWithUserAndLikesModel.user.imageId
          ? this.googleDriveService.getPublicViewURL(
              postWithUserAndLikesModel.user.imageId,
            )
          : null,
        id: postWithUserAndLikesModel.user.id,
        bio: postWithUserAndLikesModel.user.bio,
        email: postWithUserAndLikesModel.user.email,
        firstName: postWithUserAndLikesModel.user.firstName,
        lastName: postWithUserAndLikesModel.user.lastName,
        password: postWithUserAndLikesModel.user.password,
        phoneNumber: postWithUserAndLikesModel.user.phoneNumber,
      },
      isLiked: false,
    }
  }
}
