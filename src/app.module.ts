import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ProductModule } from "./resources/product/product.module"
import { PrismaModule } from "src/prisma/prisma.module"
import { StockModule } from "./resources/Stock/stock.module"
import { CustomerModule } from "./resources/Customer/customer.module"
import { OrderModule } from "./resources/Order/order.module"
import { ProductOrderModule } from "./resources/ProductOrder/product-order.module"

// this is the entry point
// if you dont import modules here, you will not be able
// to use them in your application
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ProductModule,
    StockModule,
    CustomerModule,
    OrderModule,
    ProductOrderModule,
  ],
})
export class AppModule {}
