import { NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./exception/HttpExceptionFilter"
import { PrismaService } from "./prisma/prisma.service"
const ip = require("ip")

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || "api/v1"
  const app = await NestFactory.create(AppModule)
  app
    .setGlobalPrefix(GLOBAL_PREFIX)
    .useGlobalFilters(new HttpExceptionFilter())
    .use(helmet())
    .use(cookieParser())
    .enableCors({
      origin: "*",
    })

  // comment out these two lines if you don't want
  // to connect to a database
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(PORT)
  console.log(
    `
Application started on => http://${ip.address()}:${PORT}/api/v1/
`,
  )
}
bootstrap()
