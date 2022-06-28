import { Module } from "@nestjs/common"
import { GoogleCloudConfigModule } from "src/google-cloud-config/google-cloud-config.module"
import { GoogleDriveService } from "./google-drive.service"

@Module({
  imports: [GoogleCloudConfigModule],
  exports: [GoogleDriveService],
})
export class GoogleDriveModule {}
