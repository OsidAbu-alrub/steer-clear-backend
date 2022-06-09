import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  RetrieveUserDto,
} from "./user.dto"

export default interface UserContract {
  retrieve(userDto?: RetrieveUserDto): Promise<Array<RetrieveUserDto>>
  create(createUserDto: CreateUserDto): Promise<UserDto>
  update(updateUserDto: UpdateUserDto): Promise<UserDto>
  delete(userId: UserDto["id"]): Promise<UserDto>
}
