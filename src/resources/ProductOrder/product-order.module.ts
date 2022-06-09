import { Module } from "@nestjs/common"
import { OrderModule } from "../Order/order.module"
import { ProductModule } from "../product/product.module"
import { StockModule } from "../Stock/stock.module"
import { ProductOrderController } from "./product-order.controller"
import { ProductOrderService } from "./product-order.service"

@Module({
  imports: [OrderModule, StockModule, ProductModule],
  controllers: [ProductOrderController],
  providers: [ProductOrderService],
})
export class ProductOrderModule {}
