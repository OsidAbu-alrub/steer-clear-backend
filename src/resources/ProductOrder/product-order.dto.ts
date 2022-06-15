import { ApiProperty, OmitType, PartialType, PickType } from "@nestjs/swagger"
import { Decimal } from "@prisma/client/runtime"

export class ProductOrderDto {
  @ApiProperty()
  productId: number
  @ApiProperty()
  orderId: number
  @ApiProperty()
  quantity: number
  @ApiProperty({
    type: Number,
  })
  price: Decimal
  @ApiProperty({
    type: Number,
  })
  vat: Decimal
  @ApiProperty({
    type: Number,
  })
  total: Decimal
}
export class RetrieveProductOrderDto extends PartialType(
  OmitType(ProductOrderDto, ["total", "price", "quantity", "vat"]),
) {}
export class CreateProductOrderDto extends OmitType(ProductOrderDto, [
  "orderId",
  "price",
  "vat",
  "total",
]) {
  @ApiProperty()
  customerId: number
  @ApiProperty({
    minimum: 1,
  })
  quantity: number
}
export class DeleteProductOrderDto extends PickType(ProductOrderDto, [
  "productId",
  "orderId",
]) {}
