import { Module } from "@nestjs/common"
import { GoogleCloudConfigService } from "./google-cloud-config.service"

@Module({
  exports: [GoogleCloudConfigService],
})
export class GoogleCloudConfigModule {}
