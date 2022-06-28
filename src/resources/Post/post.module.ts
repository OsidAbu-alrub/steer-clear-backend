import { Module } from "@nestjs/common"
import { PostService } from "./post.service"
import { PostController } from "./post.controller"
import { GoogleDriveModule } from "src/google-drive/google-drive.module"

@Module({
  imports: [GoogleDriveModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
