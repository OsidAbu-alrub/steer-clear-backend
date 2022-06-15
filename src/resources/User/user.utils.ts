import { CreateUserDto } from "./user.dto"
import * as bcrypt from "bcrypt"

export const isValidCreateAttributes = (
  user: Omit<CreateUserDto, "isAdmin">,
) => {
  return user.email && validateEmail(user.email) && user.password
}

export const hashPassword = async (password: string) => {
  const NUMBER_OF_ROUNDS = process.env.NUMBER_OF_ROUNDS
    ? parseInt(process.env.NUMBER_OF_ROUNDS)
    : 8
  const salt = await bcrypt.genSalt(NUMBER_OF_ROUNDS)
  return bcrypt.hash(password, salt)
}

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}
