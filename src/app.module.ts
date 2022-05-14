import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "src/prisma/prisma.module"
import { PostModule } from "./post/post.module"
import { UserModule } from "./user/user.module"

// this is the entry point
// if you dont import modules here, you will not be able
// to use them in your application
@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, PostModule, UserModule],
})
export class AppModule {}
