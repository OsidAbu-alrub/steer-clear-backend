import { Module } from "@nestjs/common"
import { GoogleDriveModule } from "src/google-drive/google-drive.module"
import { CampaignController } from "./campaign.controller"
import { CampaignService } from "./campaign.service"

@Module({
  controllers: [CampaignController],
  providers: [CampaignService],
  imports: [GoogleDriveModule],
})
export class CampaignModule {}
