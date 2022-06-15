import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { CreatePostDto, PostDto } from "./post.dto"
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
}
