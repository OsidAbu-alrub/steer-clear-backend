import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import ProductDto from "./product.dto"
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
    @Body("name") productName: ProductDto["productName"],
  ): AsyncBaseResponse<string> {
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
  async getAllProducts(): AsyncBaseResponse<ProductDto[]> {
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
  ): AsyncBaseResponse<ProductDto> {
    const product = await this.productService.findProduct(productId)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: product,
    }
  }
}
