import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { PrismaModule } from "src/prisma/prisma.module"
import { CoreModule } from "./jwt/jwt.module"
import { AuthModule } from "./resources/Auth/auth.module"
import { CustomerModule } from "./resources/Customer/customer.module"
import { OrderModule } from "./resources/Order/order.module"
import { ProductModule } from "./resources/Product/product.module"
import { ProductOrderModule } from "./resources/ProductOrder/product-order.module"
import { StockModule } from "./resources/Stock/stock.module"
import { UserModule } from "./resources/User/user.module"
import { RolesGuard } from "./roles/roles.guard"
// this is the entry point
// if you dont import modules here, you will not be able
// to use them in your application
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    CoreModule,
    ProductModule,
    StockModule,
    CustomerModule,
    OrderModule,
    ProductOrderModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
