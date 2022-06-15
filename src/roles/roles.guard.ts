import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { JwtPayload } from "src/jwt/jwt.strategy"
import { IS_ADMIN_KEY } from "./roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
  // allows us to read metadata
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  /**
   *
   * @param context - current execution context
   * @returns can or cannot edit (true if has access, false if not)
   */
  canActivate(context: ExecutionContext): boolean {
    // provide the key of metadata (IS_ADMIN_KEY) so that you can check
    // if the user has access to current context or not
    const hasToBeAdmin = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!hasToBeAdmin) return true

    const req: Request = context.switchToHttp().getRequest()
    const user = this.jwtService.decode(
      req.cookies[process.env.JWT_COOKIE_NAME],
    ) as JwtPayload

    return user?.isAdmin === hasToBeAdmin
  }
}
