import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"

export class ProductDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  productName: string
  @ApiProperty()
  description: string
  @ApiProperty()
  price: number
  @ApiProperty()
  vat: number
  @ApiProperty()
  stockable: boolean
  @ApiProperty()
  priceAfterVat: number
}

export class CreateProductDto extends OmitType(ProductDto, [
  "id",
  "priceAfterVat",
]) {}

/**
 * PartialType(
 *  OmitType(ProductDto, ["priceAfterVat", "id"]),
 *  )
 * makes ID property required on type UpdateProductDto
 */
export class UpdateProductDto extends PartialType(
  OmitType(ProductDto, ["priceAfterVat", "id"]),
) {
  @ApiProperty()
  id: number
}
