import { Module } from "@nestjs/common"
import * as dotenv from "dotenv"
import { JwtStrategy } from "src/jwt/jwt.strategy"
import { CustomerModule } from "../Customer/customer.module"
import { UserModule } from "../User/user.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
dotenv.config()

@Module({
  imports: [UserModule, CustomerModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
