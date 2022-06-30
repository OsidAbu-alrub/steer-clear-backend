import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"
import { Category, Continent } from "@prisma/client"
import { IsDefined, IsString, IsUUID } from "class-validator"
import { CategoryDto } from "../Category/category.dto"
import { ContinentDto } from "../Continent/continent.dto"

interface IncludeQuery {
  category?: boolean
  continent?: boolean
}

export class ProductDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  continentId: string
  @ApiProperty()
  categoryId: string
  @ApiProperty()
  uploadedBy: string
  @ApiProperty()
  uploadedAt: Date
  @ApiProperty()
  barcode: string
  @ApiProperty()
  name: string
  @ApiProperty()
  isBadProduct: boolean
  @ApiProperty()
  image?: string
  @ApiProperty()
  category?: CategoryDto
  @ApiProperty()
  continent?: ContinentDto
}
export class RetrieveProductDto extends PartialType(
  OmitType(ProductDto, ["image", "isBadProduct", "uploadedAt"]),
) {
  include?: IncludeQuery
}
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
  @ApiProperty()
  @IsDefined()
  @IsString()
  uploadedBy: string
}

export class ProductModelWithContentAndCategory {
  id: string
  continentId: string
  categoryId: string
  uploadedBy: string
  uploadedAt: Date
  barcode: string
  name: string
  imageId: string
  category?: Category
  continent?: Continent
}

export class CreateProductDtoWithImageId {
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
  @ApiProperty()
  @IsDefined()
  @IsString()
  uploadedBy: string
  @ApiProperty()
  @IsDefined()
  @IsString()
  imageId: string
}
