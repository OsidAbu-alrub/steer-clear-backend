import { Module } from "@nestjs/common"
import { GoogleDriveModule } from "src/google-drive/google-drive.module"
import { JwtStrategy } from "src/jwt/jwt.strategy"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [GoogleDriveModule],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}
