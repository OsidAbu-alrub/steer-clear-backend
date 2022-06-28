import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ApiResponse } from "@nestjs/swagger"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import { CreatePostDto, LikeDto, PostDto } from "./post.dto"
import { PostService } from "./post.service"

@UseGuards(JwtAuthGuard)
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * Create post object
   * @param post - post to create
   * @returns createdPost - The created post
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "post created successfully",
  })
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

  /**
   * Get user feed
   * @param userId - user id to get feed for
   * @returns posts - user's feed
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "post created successfully",
  })
  @Get("feed")
  async getFeed(@Query("userId") userId: string): AsyncBaseResponse<PostDto[]> {
    const posts = await this.postService.getFeed(userId)
    return {
      data: posts,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Get("personal-posts")
  async getUserPosts(
    @Query("postUserId") postUserId: string,
    @Query("userId") userId: string,
  ): AsyncBaseResponse<PostDto[]> {
    const userPosts = await this.postService.getUserPosts(userId, postUserId)
    return {
      data: userPosts,
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
    }
  }

  @Get("find")
  async getPost(
    @Query("postId") postId: string,
    @Query("userId") userId: string,
  ): AsyncBaseResponse<PostDto> {
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
