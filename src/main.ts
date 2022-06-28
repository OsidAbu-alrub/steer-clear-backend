import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import helmet from "helmet"
import { getLocalIPAddress } from "./../ip-config"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./exception/HttpExceptionFilter"
import { LogPipe } from "./pipes/logger.pipe"
import { PrismaService } from "./prisma/prisma.service"

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || "api/v1"
  const app = await NestFactory.create(AppModule)
  app
    .setGlobalPrefix(GLOBAL_PREFIX)
    .useGlobalFilters(new HttpExceptionFilter())
    .use(helmet())
    .use(cookieParser())
    .useGlobalPipes(new ValidationPipe(), new LogPipe())
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
Application started on => http://${getLocalIPAddress()}:${PORT}/api/v1/
`,
  )
}
bootstrap()
