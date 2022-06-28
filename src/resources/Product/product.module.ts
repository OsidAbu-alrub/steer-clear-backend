import { Module } from "@nestjs/common"
import { GoogleDriveModule } from "src/google-drive/google-drive.module"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service"

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [GoogleDriveModule],
})
export class ProductModule {}
