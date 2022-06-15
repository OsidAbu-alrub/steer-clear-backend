import { Response } from "express"
import { LoginAuthDto, RegisterAuthDto } from "./auth.dto"

export default interface AuthContract {
  login(authDto: LoginAuthDto, response: Response): Promise<boolean>
  register(authDto: RegisterAuthDto, response: Response): Promise<boolean>
  logout(response: Response): Promise<boolean>
}
