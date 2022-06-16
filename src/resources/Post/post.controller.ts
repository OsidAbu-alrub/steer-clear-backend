import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common"
import { PostComment } from "@prisma/client"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import {
  CreateCommentDto,
  CreatePostDto,
  LikeDto,
  PostDto,
  PostFeedDto,
} from "./post.dto"
import { PostService } from "./post.service"

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post("create")
  async createPost(@Body() post: CreatePostDto): AsyncBaseResponse<PostDto> {
    const createdPost = await this.postService.createPost(post)
    return {
      data: createdPost,
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
    }
  }

  @Get("feed")
  async getFeed(
    @Query("userId") userId: string,
  ): AsyncBaseResponse<PostFeedDto[]> {
    const posts = await this.postService.getFeed(userId)
    return {
      data: posts,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Post("comment")
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): AsyncBaseResponse<PostComment> {
    const createdComment = await this.postService.createComment(
      createCommentDto,
    )
    return {
      data: createdComment,
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
    }
  }

  @Get("find")
  async getPost(
    @Query("postId") postId: string,
    @Query("userId") userId: string,
  ): AsyncBaseResponse<PostFeedDto> {
    const post = await this.postService.findPost(postId, userId)
    return {
      data: post,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Post("like")
  async likePost(@Body() likeDto: LikeDto): AsyncBaseResponse<boolean> {
    const isDone = await this.postService.likePost(likeDto)
    return {
      data: isDone,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }
}
