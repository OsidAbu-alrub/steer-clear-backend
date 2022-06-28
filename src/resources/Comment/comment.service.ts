import { Injectable } from "@nestjs/common"
import { PostComment as Comment } from "@prisma/client"
import { GoogleDriveService } from "src/google-drive/google-drive.service"
import { PrismaService } from "src/prisma/prisma.service"
import {
  CommentDto,
  CommentWithUserModel,
  CreateCommentDto,
  RetrieveCommentDto,
} from "./comment.dto"

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  retrieve = async (
    retrieveCommentDto: RetrieveCommentDto = {},
  ): Promise<Array<CommentDto>> => {
    const retrieveModel = this.fromRetrieveDto(retrieveCommentDto)
    const comments: CommentWithUserModel[] =
      await this.prismaService.postComment.findMany({
        where: retrieveModel,
        include: {
          user: true,
        },
        orderBy: {
          createdOn: "desc",
        },
      })
    return comments.map(this.fromCommentWithUserModel)
  }

  create = async (createCommentDto: CreateCommentDto): Promise<CommentDto> => {
    const createModel = this.fromCreateDto(createCommentDto)
    const createdComment: CommentWithUserModel =
      await this.prismaService.postComment.create({
        data: createModel,
        include: {
          user: true,
        },
      })
    return this.fromCommentWithUserModel(createdComment)
  }
  /************** UTILITY METHODS **************/
  private fromCreateDto = (createCommentDto: CreateCommentDto): Comment => {
    return {
      body: createCommentDto.body,
      createdOn: new Date(),
      id: undefined,
      postId: createCommentDto.postId,
      userId: createCommentDto.userId,
    }
  }
  private fromRetrieveDto = (
    retrieveCommentDto: RetrieveCommentDto,
  ): Comment => {
    return {
      body: retrieveCommentDto.body ?? undefined,
      postId: retrieveCommentDto.postId ?? undefined,
      userId: retrieveCommentDto.userId ?? undefined,
      createdOn: retrieveCommentDto.createdOn ?? undefined,
      id: retrieveCommentDto.id ?? undefined,
    }
  }
  private fromDto = (commentDto: CommentDto): Comment => {
    return {
      body: commentDto.body,
      createdOn: commentDto.createdOn,
      id: commentDto.id,
      postId: commentDto.postId,
      userId: commentDto.userId,
    }
  }
  private fromModel = (comment: Comment): CommentDto => {
    return {
      body: comment.body,
      createdOn: comment.createdOn,
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      user: undefined,
    }
  }

  private fromCommentWithUserModel = (
    commentWithUserModel: CommentWithUserModel,
  ): CommentDto => {
    return {
      body: commentWithUserModel.body,
      createdOn: commentWithUserModel.createdOn,
      id: commentWithUserModel.id,
      postId: commentWithUserModel.postId,
      userId: commentWithUserModel.userId,
      user: {
        image: commentWithUserModel.user.imageId
          ? this.googleDriveService.getPublicViewURL(
              commentWithUserModel.user.imageId,
            )
          : null,
        id: commentWithUserModel.user.id,
        bio: commentWithUserModel.user.bio,
        email: commentWithUserModel.user.email,
        firstName: commentWithUserModel.user.firstName,
        lastName: commentWithUserModel.user.lastName,
        password: commentWithUserModel.user.password,
        phoneNumber: commentWithUserModel.user.phoneNumber,
      },
    }
  }
}
