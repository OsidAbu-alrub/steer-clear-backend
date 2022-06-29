import { ApiProperty, PartialType } from "@nestjs/swagger"
import { IsDefined, IsString, MaxLength } from "class-validator"

interface IncludeQuery {
  products?: boolean
}

export class CategoryDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  name: string
  @ApiProperty()
  description: string
}
export class RetrieveCategoryDto extends PartialType(CategoryDto) {
  include?: IncludeQuery
}
export class CreateCategoryDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  name: string
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  description: string
}
