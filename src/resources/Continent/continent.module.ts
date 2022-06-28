import { Module } from "@nestjs/common"
import { ContinentController } from "./continent.controller"
import { ContinentService } from "./continent.service"

@Module({
  controllers: [ContinentController],
  providers: [ContinentService],
})
export class ContinentModule {}
