import * as bcrypt from "bcrypt"

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
) => bcrypt.compare(password, hashedPassword)

export const hashPassword = async (password: string) => {
  const NUMBER_OF_ROUNDS = process.env.NUMBER_OF_ROUNDS
    ? parseInt(process.env.NUMBER_OF_ROUNDS)
    : 8
  const salt = await bcrypt.genSalt(NUMBER_OF_ROUNDS)
  return bcrypt.hash(password, salt)
}
