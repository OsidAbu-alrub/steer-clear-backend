import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"

export class OrderDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  customerId: number
  @ApiProperty()
  orderedAt: string
}
export class RetrieveOrderDto extends PartialType(OrderDto) {}
export class CreateOrderDto extends OmitType(OrderDto, ["id", "orderedAt"]) {}
export class UpdateOrderDto extends PartialType(
  OmitType(OrderDto, ["orderedAt", "id"]),
) {
  @ApiProperty()
  id: number
}
