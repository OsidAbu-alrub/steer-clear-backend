import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "src/prisma/prisma.module"
import { PostModule } from "./resources/Post/post.module"
import { UserModule } from "./resources/User/user.module"
import { CoreModule } from "./jwt/jwt.module"
import { CommentModule } from "./resources/Comment/comment.module"
import { GoogleDriveModule } from "./google-drive/google-drive.module"
import { CategoryModule } from "./resources/Category/category.module"
import { ContinentModule } from "./resources/Continent/continent.module"
import { ProductModule } from "./resources/Product/product.module"
// this is the entry point
// if you dont import modules here, you will not be able
// to use them in your application
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    CoreModule,
    PostModule,
    UserModule,
    CommentModule,
    GoogleDriveModule,
    CategoryModule,
    ContinentModule,
    ProductModule,
  ],
})
export class AppModule {}
