import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"

export class StockDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  productId: number
  @ApiProperty()
  quantity: number
  @ApiProperty()
  updatedAt: Date
}

export class RetrieveStockDto extends PartialType(
  OmitType(StockDto, ["updatedAt"]),
) {}

export class CreateStockDto extends OmitType(StockDto, ["id", "updatedAt"]) {
  @ApiProperty()
  productId: number
}

type Operation = "increment" | "decrement"

export class UpdateStockDto extends PartialType(
  OmitType(StockDto, ["id", "updatedAt"]),
) {
  @ApiProperty()
  id: number
  @ApiProperty({
    description: "type of operation to do on quantity",
    default: "increment",
    required: false,
    type: "increment | decrement",
  })
  operation?: Operation
}
