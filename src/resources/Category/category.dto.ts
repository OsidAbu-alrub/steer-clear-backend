import { PartialType } from "@nestjs/swagger"
import { IsDefined, IsString, MaxLength } from "class-validator"

export class CategoryDto {
  id: string
  title: string
  description: string
}
export class RetrieveCategoryDto extends PartialType(CategoryDto) {}
export class CreateCategoryDto {
  @IsDefined()
  @IsString()
  title: string
  @IsDefined()
  @IsString()
  @MaxLength(100)
  description: string
}
