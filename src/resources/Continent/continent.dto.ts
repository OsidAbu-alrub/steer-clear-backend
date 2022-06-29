import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Product } from "@prisma/client"
import { IsDefined, IsString } from "class-validator"

export class ContinentDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  name: string
  @ApiProperty()
  products?: Product[]
}
export class RetrieveContinentDto extends PartialType(ContinentDto) {}
export class CreateContinentDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  name: string
}
