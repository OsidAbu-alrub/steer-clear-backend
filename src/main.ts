import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"
import helmet from "helmet"
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

  const config = new DocumentBuilder()
    .setTitle("SteerClear")
    .setDescription("API Decription")
    .setVersion("1.0")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  // comment out these two lines if you don't want
  // to connect to a database
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(PORT)
}
bootstrap()
