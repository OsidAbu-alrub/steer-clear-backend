import { HttpStatus, Injectable } from "@nestjs/common"
import { Product } from "@prisma/client"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import ProductContract from "./product.contract"
import ProductDto from "./product.dto"

@Injectable()
export class ProductService implements ProductContract {
  constructor(private readonly prismaService: PrismaService) {}

  toModel(dto: ProductDto): Product {
    return {
      name: dto.productName,
      productId: Number(dto.productId),
    }
  }
  toDto(model: Product): ProductDto {
    return {
      productId: model.productId + "",
      productName: model.name,
    }
  }

  async createProduct(
    productName: ProductDto["productName"],
  ): Promise<ProductDto["productId"]> {
    const productModel = await this.prismaService.product.create({
      data: { name: productName },
    })
    const productDto = this.toDto(productModel)
    return productDto.productId
  }

  async getAllProducts(): Promise<Array<ProductDto>> {
    const products = await this.prismaService.product.findMany()
    return products.map(this.toDto)
  }

  async findProduct(productId: ProductDto["productId"]) {
    const productModel = this.toModel({ productId, productName: "" })
    const product = await this.prismaService.product.findUnique({
      where: {
        productId: productModel.productId,
      },
    })
    if (!product)
      throw new GenericHttpException(
        `Product with id ${productId} wasn't found`,
        HttpStatus.NOT_FOUND,
      )
    return this.toDto(product)
  }
}
