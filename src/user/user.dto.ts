export interface UserDto {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  bio: string
}

export type CreateUserDto = {
  id?: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  bio: string
}
