import { HttpStatus, Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import * as dotenv from "dotenv"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"
import { GenericHttpException } from "src/exception/GenericHttpException"
dotenv.config()

export class JwtPayload {
  isAdmin: boolean
  email: string
  sub: number
  iat?: number
  exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request.cookies["jwt"]
          if (!data) {
            throw new GenericHttpException(
              "Must login!",
              HttpStatus.UNAUTHORIZED,
            )
          }
          return data
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET_KEY + "",
    })
  }

  async validate(payload: JwtPayload) {
    return payload
  }
}
