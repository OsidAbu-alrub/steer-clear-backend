import { HttpStatus, Injectable } from "@nestjs/common"
import { Product } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { NUMBER_OF_DECIMAL_PLACES } from "src/global/constants"
import { PrismaService } from "src/prisma/prisma.service"
import ProductContract from "./product.contract"
import { ProductDto, CreateProductDto, UpdateProductDto } from "./product.dto"

@Injectable()
export class ProductService implements ProductContract {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductDto["id"]> {
    const productModel = this.toCreateModel(createProductDto)
    const createdProduct = await this.prismaService.product.create({
      data: productModel,
    })
    return createdProduct.id
  }

  async getAllProducts(): Promise<Array<ProductDto>> {
    const products = await this.prismaService.product.findMany()
    return products.map(this.toDto)
  }

  async findProduct(productId: ProductDto["id"]) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
      rejectOnNotFound: () =>
        new GenericHttpException(
          `Product with id ${productId} wasn't found`,
          HttpStatus.NOT_FOUND,
        ),
    })

    return this.toDto(product)
  }

  async updateProduct(productDto: UpdateProductDto) {
    await this.findProduct(productDto.id)
    const productModel = this.toUpdateModel(productDto)
    const updatedProduct = await this.prismaService.product.update({
      where: {
        id: productModel.id,
      },
      data: productModel,
    })
    return this.toDto(updatedProduct)
  }

  async deleteProduct(productId: ProductDto["id"]) {
    await this.findProduct(productId)
    const deletedProduct = await this.prismaService.product.delete({
      where: {
        id: productId,
      },
    })

    if (!deletedProduct)
      throw new GenericHttpException(
        `Product with id ${productId} can't be deleted`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    return this.toDto(deletedProduct)
  }

  toModel({
    description,
    id,
    price,
    productName,
    stockable,
    vat,
  }: Partial<ProductDto>): Product {
    return {
      id,
      price: new Decimal(price),
      vat: new Decimal(vat),
      name: productName,
      slug: description,
      stockable,
      reference: "",
    }
  }

  toCreateModel({
    description,
    price,
    productName,
    vat,
    stockable,
  }: CreateProductDto): Omit<Product, "id"> {
    return {
      price: new Decimal(price),
      vat: new Decimal(vat),
      name: productName,
      slug: description,
      stockable,
      reference: "",
    }
  }

  toUpdateModel({
    description,
    id,
    price,
    productName,
    vat,
    stockable,
  }: UpdateProductDto): Product {
    return {
      id,
      price: new Decimal(price),
      vat: new Decimal(vat),
      name: productName,
      slug: description,
      stockable: stockable,
      reference: undefined,
    }
  }

  toDto = (model: Product): ProductDto => {
    return {
      id: model.id,
      description: model.slug,
      price: model.price.toNumber(),
      vat: model.vat.toNumber(),
      productName: model.name,
      stockable: model.stockable,
      priceAfterVat: this.calculatePriceAfterVat(model.price, model.vat),
    }
  }

  private calculatePriceAfterVat(price: Decimal, vat: Decimal) {
    return price
      .mul(vat)
      .plus(price)
      .toDecimalPlaces(NUMBER_OF_DECIMAL_PLACES)
      .toNumber()
  }
}
