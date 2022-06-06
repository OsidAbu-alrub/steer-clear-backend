import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ProductModule } from "./resources/product/product.module"
import { PrismaModule } from "src/prisma/prisma.module"

// this is the entry point
// if you dont import modules here, you will not be able
// to use them in your application
@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, ProductModule],
})
export class AppModule {}
