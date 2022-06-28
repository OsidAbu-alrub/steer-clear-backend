import { Module } from "@nestjs/common"
import { GoogleDriveModule } from "src/google-drive/google-drive.module"
import { CommentController } from "./comment.controller"
import { CommentService } from "./comment.service"

@Module({
  imports: [GoogleDriveModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
