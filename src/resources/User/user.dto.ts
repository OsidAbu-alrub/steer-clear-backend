import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger"

export class UserDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  email: string
  @ApiProperty()
  password: string
  @ApiProperty({
    default: false,
    required: false,
  })
  isAdmin: boolean
}
export class RetrieveUserDto extends PartialType(UserDto) {}
export class CreateUserDto extends OmitType(UserDto, ["id"]) {}
export class UpdateUserDto extends PartialType(OmitType(UserDto, ["id"])) {
  @ApiProperty()
  id: number
}
