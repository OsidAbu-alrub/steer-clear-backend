import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import { CommentDto, CreateCommentDto, RetrieveCommentDto } from "./comment.dto"
import { CommentService } from "./comment.service"

@UseGuards(JwtAuthGuard)
@ApiTags("Comment")
@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Get Comment objects from database
   * @param retrieveCommentDto - object that the retrieval query is based on
   * @returns arrayOfComment - Get Comment objects from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Comment retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveCommentDto: RetrieveCommentDto,
  ): AsyncBaseResponse<Array<CommentDto>> {
    const arrayOfComment = await this.commentService.retrieve(
      retrieveCommentDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfComment,
    }
  }

  /**
   * creates a Comment and stores it in the database
   *
   * @param createCommentDto - Comment to be created
   * @returns createdComment - the CommentDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Comment created successfully",
  })
  @Post("create")
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): AsyncBaseResponse<CommentDto> {
    const createdComment = await this.commentService.create(createCommentDto)
    return {
      data: createdComment,
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
    }
  }
}
