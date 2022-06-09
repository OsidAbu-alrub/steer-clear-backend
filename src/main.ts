import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./exception/HttpExceptionFilter"
import { TAGS } from "./global/constants"
import { PrismaService } from "./prisma/prisma.service"
import * as cookieParser from "cookie-parser"

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
      credentials: true,
      origin: "*",
    })
  // .useGlobalPipes()

  const config = new DocumentBuilder()
    .setTitle("Orders Management API")
    .setDescription("Orders Management API description")
    .setVersion("1.0")
    .addTag(TAGS.ORDER)
    .addTag(TAGS.CUSTOMER)
    .addTag(TAGS.PRODUCT)
    .addTag(TAGS.PRODUCT_ORDER)
    .addTag(TAGS.STOCK)
    .addTag(TAGS.USER)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(GLOBAL_PREFIX, app, document)

  // comment out these two lines if you don't want
  // to connect to a database
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(PORT)
  console.log(
    `
Application started on => http://localhost:${PORT}/
Swagger started on => http://localhost:${PORT}/${GLOBAL_PREFIX}/
`,
  )
}
bootstrap()
