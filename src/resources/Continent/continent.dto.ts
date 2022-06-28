import { PartialType } from "@nestjs/swagger"
import { Product } from "@prisma/client"
import { IsDefined, IsString } from "class-validator"

export class ContinentDto {
  id: string
  name: string
  products?: Product[]
}
export class RetrieveContinentDto extends PartialType(ContinentDto) {}
export class CreateContinentDto {
  @IsDefined()
  @IsString()
  name: string
}
export class UpdateContinentDto {}
