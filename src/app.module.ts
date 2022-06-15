import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "src/prisma/prisma.module"
import { PostModule } from "./resources/Post/post.module"
import { UserModule } from "./resources/User/user.module"

import { APP_GUARD } from "@nestjs/core"
import { CoreModule } from "./jwt/jwt.module"
import { RolesGuard } from "./roles/roles.guard"
import { AutomapperModule } from "@automapper/nestjs"
import { classes } from "@automapper/classes"
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
