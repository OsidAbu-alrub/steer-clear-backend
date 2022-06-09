import { ApiProperty } from "@nestjs/swagger"

export class AuthDto {
  @ApiProperty({
    required: true,
  })
  email: string
  @ApiProperty({
    required: true,
  })
  password: string
  @ApiProperty({
    required: true,
  })
  isAdmin: boolean
}
export class LoginAuthDto {
  @ApiProperty({
    required: true,
  })
  email: string
  @ApiProperty({
    required: true,
  })
  password: string
}
export class RegisterAuthDto extends AuthDto {
  @ApiProperty({
    required: true,
  })
  firstName: string
  @ApiProperty({
    required: true,
  })
  lastName: string
  @ApiProperty({
    required: true,
  })
  dateOfBirth: string
}
