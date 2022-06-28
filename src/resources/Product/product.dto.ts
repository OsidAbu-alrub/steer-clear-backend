import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"
import { IsDefined, IsString, IsUUID } from "class-validator"

export class ProductDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  continentId: string
  @ApiProperty()
  categoryId: string
  @ApiProperty()
  barcode: string
  @ApiProperty()
  name: string
  @ApiProperty()
  image?: string
}
export class RetrieveProductDto extends PartialType(
  OmitType(ProductDto, ["image"]),
) {}
export class CreateProductDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID("all")
  continentId: string
  @ApiProperty()
  @IsDefined()
  @IsUUID("all")
  categoryId: string
  @ApiProperty()
  @IsDefined()
  @IsString()
  barcode: string
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string
}
