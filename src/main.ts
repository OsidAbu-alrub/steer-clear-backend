import { NestFactory } from "@nestjs/core"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./exception/HttpExceptionFilter"
import { PrismaService } from "./prisma/prisma.service"

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule)
  // const { httpAdapter } = app.get(HttpAdapterHost)
  app.setGlobalPrefix("api/v1")
  app.use(helmet())
  app.useGlobalFilters(new HttpExceptionFilter())

  // comment out these two lines if you don't want
  // to connect to a database
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(PORT)
  console.log(
    `
Application started on => http://localhost:${PORT}/
`,
  )
}
bootstrap()
