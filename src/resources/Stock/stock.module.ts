import { Module } from "@nestjs/common"
import { ProductModule } from "../Product/product.module"
import { StockController } from "./stock.controller"
import { StockService } from "./stock.service"

@Module({
  imports: [ProductModule],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
