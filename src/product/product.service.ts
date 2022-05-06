import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common"
import { Product } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    productName: Product["name"],
  ): Promise<Product["productId"]> {
    const createdProduct = await this.prismaService.product.create({
      data: { name: productName },
    })
    return createdProduct.productId
  }

  async getAllProducts(): Promise<Array<Product>> {
    const products = await this.prismaService.product.findMany()
    return products
  }

  async findProduct(productId: Product["productId"]) {
    const product = await this.prismaService.product.findUnique({
      where: {
        productId,
      },
    })
    if (!product)
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id ${productId} wasn't found`,
      })
    return product
  }
}
