import { HttpStatus, Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"
import { GenericHttpException } from "src/exception/GenericHttpException"

export class JwtPayload {
  email: string
  password: string
  sub: string
  iat: number
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request.cookies[process.env.JWT_COOKIE_NAME]
          if (!data) {
            throw new GenericHttpException(
              "You must login first!",
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
