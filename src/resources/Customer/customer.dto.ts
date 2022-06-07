import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"

export class CustomerDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  firstName: string
  @ApiProperty()
  lastName: string
  @ApiProperty()
  dateOfBirth: string
}
export class RetrieveCustomerDto extends PartialType(CustomerDto) {}
export class CreateCustomerDto extends OmitType(CustomerDto, ["id"]) {}
export class UpdateCustomerDto extends PartialType(
  OmitType(CustomerDto, ["id"]),
) {
  @ApiProperty()
  id: number
}
