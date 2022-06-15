import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "src/prisma/prisma.module"
import { PostModule } from "./resources/Post/post.module"
import { UserModule } from "./resources/User/user.module"

import { classes } from "@automapper/classes"
import { AutomapperModule } from "@automapper/nestjs"
import { CoreModule } from "./jwt/jwt.module"
// this is the entry point
// if you dont import modules here, you will not be able
// to use them in your application
@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ConfigModule.forRoot(),
    PrismaModule,
    PostModule,
    UserModule,
    CoreModule,
  ],
})
export class AppModule {}
