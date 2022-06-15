import * as bcrypt from "bcrypt"

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
) => bcrypt.compare(password, hashedPassword)
