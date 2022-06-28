import { Module } from "@nestjs/common"
import { GoogleCloudConfigService } from "./google-cloud-config.service"

@Module({
  providers: [GoogleCloudConfigService],
  exports: [GoogleCloudConfigService],
})
export class GoogleCloudConfigModule {}
