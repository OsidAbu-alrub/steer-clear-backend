import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common"
import { Product } from "@prisma/client"
import { AsyncBaseResponse, ValidationResponse } from "src/BaseResponse"
import { ProductService } from "./product.service"

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Adds a product to database
   *
   * @param productName
   * @returns productId - the ID of the added product
   */
  @Post("add")
  async addProduct(
    @Body("name") productName: Product["name"],
  ): AsyncBaseResponse<Product["productId"]> {
    const createdProductId = await this.productService.createProduct(
      productName,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: createdProductId,
    }
  }

  /**
   * Gets all products from database
   *
   * @returns products - All the products in the database
   */
  @Get("all")
  async getAllProducts(): AsyncBaseResponse<Product[]> {
    const products = await this.productService.getAllProducts()
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: products,
    }
  }

  /**
   * get a specific product from database
   *
   * @param productId - the ID of the queried product
   * @returns product - the product queried from database
   */
  @Get(":id")
  async findProduct(
    @Param("id") productId: string,
  ): AsyncBaseResponse<Product> {
    try {
      const product = await this.productService.findProduct(+productId)
      return {
        validation: {
          message: "",
          statusCode: HttpStatus.OK,
        },
        data: product,
      }
    } catch (e: unknown) {
      const error = e as HttpException
      return {
        validation: { ...(error.getResponse() as ValidationResponse) },
        data: null,
      }
    }
  }
}
