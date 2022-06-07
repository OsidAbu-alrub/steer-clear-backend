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
  OmitType(StockDto, ["updatedAt", "quantity"]),
) {}

export class CreateStockDto extends OmitType(StockDto, ["id", "updatedAt"]) {}

export class UpdateStockDto extends PartialType(
  OmitType(StockDto, ["id", "updatedAt"]),
) {
  @ApiProperty()
  id: number
}
